import React from 'react';
import ReactDOM from 'react-dom';
import {createHashHistory} from 'history';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import prefixNamespace from '../dva-core/prefixNamespace';
import createSagaMiddleware from 'redux-saga';
import {getSagas} from '../dva-core/getSaga';
import { routerRedux } from './router';
import {run} from '../dva-core/subscription';
import Plugin, {filterHooks} from '../dva-core/plugin';

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
      initialReducers[model.namespace] = getReducer(model);
    }
    const rootReducer = createReducer(); // 返回一个根的reducer
    const sages = getSagas(app, plugin);
  
    const sagaMiddleware = createSagaMiddleware();
    app._store = applyMiddleware(routerMiddleware(history), sagaMiddleware)(createStore)(rootReducer);

    run(app);

    sages.forEach(sagaMiddleware.run); // 启动saga执行

    ReactDOM.render(
      <Provider store={app._store}>
        {app._router({history, app})}
      </Provider>,
      document.querySelector(container));

    function createReducer() {
      const extraReducers = plugin.get('extraReducers');
      return combineReducers({
        ...initialReducers,
        ...extraReducers
      })
    }
  }

  function getReducer(model) {
    const {state: defaultState, reducers={}} = model;
    return function(state=defaultState, action) {
      const reducer = reducers[action.type];
      if(reducer) {
        return reducer(state, action);
      }
      return state;
    }
  }

  return app;
}