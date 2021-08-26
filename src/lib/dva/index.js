import React from 'react';
import ReactDOM from 'react-dom';
import {createHashHistory} from 'history';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {Provider, connect} from 'react-redux';
import prefixNamespace from '../dva-core/prefixNamespace';
import createSagaMiddleware from 'redux-saga';
import {getSagas} from '../dva-core/getSaga';
import { routerRedux } from './router';
import {run, runSubscription} from '../dva-core/subscription';
import Plugin, {filterHooks} from '../dva-core/plugin';
import {getSaga} from '../dva-core/getSaga'

const  {routerMiddleware, connectRouter} = routerRedux;
export {
  connect
}
export default function dva(opts={}) {
  const history = opts.history || createHashHistory();
  const app = {
    _history: history,
    _models: [],
    model,
    _router: null,
    router,
    start
  }
  const initialReducers = { // 初始的reducer
    // 当页面路径发生改变时，会向仓库派发动作，仓库状态会发生改变
    router: connectRouter(app._history)
  };

  const plugin = new Plugin();
  plugin.use(filterHooks(opts));
  app.use = plugin.use.bind(plugin);

  function model(m) {
    const prefixedModel = prefixNamespace(m);
    m = prefixedModel;
    app._models.push(m);
    return prefixedModel;
  }
  function router(router) {
    app._router = router; // 定义路由
  }
  function start(container) {
    for (const model of app._models) {
      initialReducers[model.namespace] = getReducer(model, plugin._handleActions);
    }
    const rootReducer = createReducer(); // 返回一个根的reducer
    const sages = getSagas(app, plugin);
  
    const sagaMiddleware = createSagaMiddleware();
    const extraMiddleware = plugin.get('onAction');

    // todo: extraEnhancers
    // applyMiddleware 返回是一个enhancer，增加 createStore
    const extraEnhancers = plugin.get('extraEnhancers');
    const enhancers = [...extraEnhancers, applyMiddleware(routerMiddleware(history), sagaMiddleware, ...extraMiddleware)];
    // app._store = applyMiddleware(routerMiddleware(history), sagaMiddleware, ...extraMiddleware)(createStore)(rootReducer, opts.initialState);
    app._store = createStore(rootReducer, opts.initialReducers, compose(...enhancers));

    // todo:stateChange
    const onStateChange = plugin.get('onStateChange');
    app._store.subscribe(() => {
      onStateChange.forEach(listener => listener(app._store.getState()));
    });
    run(app);

    sages.forEach(sagaMiddleware.run); // 启动saga执行

    ReactDOM.render(
      <Provider store={app._store}>
        {app._router({history, app})}
      </Provider>,
      document.querySelector(container));

    function createReducer() {
      const reduceEnhancer = plugin.get('onReducer')
      const extraReducers = plugin.get('extraReducers');
      return reduceEnhancer(combineReducers({
        ...initialReducers,
        ...extraReducers
      }))
    }

    // 对当前的应用插入一个模型，需要处理 state reducers subscriptions effects
    app.model = injectModel.bind(app);
    function injectModel(m) {
      m = model(m); // 给 reducers effects 加命名空间前缀
      initialReducers[m.namespace] = getReducer(m, plugin._handleActions);
      // todo：replaceReducer 会默认派发动作，会让 reducer 执行
      app._store.replaceReducer(createReducer()); // 新的reducer替换新的reducer
      if(m.effects) {
        sagaMiddleware.run(getSaga(m.effects, m, plugin.get('onEffect')));
      }
      if(m.subscriptions) {
        runSubscription(m.subscriptions, app)
      }
    }
  }

  function getReducer(model, handleActions) {
    const {state: defaultState, reducers={}} = model;
    const reducer = (state=defaultState, action) => {
      const reducer = reducers[action.type];
      if(reducer) {
        return reducer(state, action);
      }
      return state;
    }
    if(handleActions) {
      return handleActions(reducers, defaultState);
    }
    return reducer;
  }

  return app;
}