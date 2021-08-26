import dva from './lib/dva';
import './index.css';
import createLogger from './lib/redux-logger';
import {createBrowserHistory} from 'history';
import createLoading from './lib/dva-loading';
import undoable from './lib/redux-undo';
import {persistReducer, persistStore} from './lib/redux-persist';
import storage from './lib/redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage
}

// todo: 1. Initialize
const app = dva({
  onAction: createLogger,
  history: createBrowserHistory(),
  // initialState: localStorage.getItem('state')?JSON.parse(localStorage.getItem('state')):undefined,
  onReducer: reducer => {
    const undoReducer = undoable(reducer);
    const rootReducer = persistReducer(persistConfig, undoReducer);
    return function (state, action) {
      const newState = rootReducer(state, action);
      return {...newState, router: newState.present && newState.present.router || {}}
    }
  },
  // 跟别的hook不一样，只能写一个，写多个后面的会覆盖前面的
  extraEnhancers: [
    createStore => (...args) => {
      const store = createStore(...args);
      const persistor = persistStore(store);
      store.persistor = persistor;
      return store;
    }
  ]
});

// todo: 2. Plugins
app.use(createLoading());
// app.use({
//   onStateChange(state) {
//     localStorage.setItem('state', JSON.stringify(state));
//   }
// })

// todo:  3. Model，注册模型 
app.model(require('./models/counter').default);
// app.model(require('./models/user').default);

// todo: 4. Router
app.router(require('./router').default);

// todo: 5. Start
app.start('#root');
