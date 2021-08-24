import dva from './lib/dva';
import './index.css';
import createLogger from 'redux-logger';
import {createBrowserHistory} from 'history';
import createLoading from './lib/dva-loading';

// todo: 1. Initialize
const app = dva({
  onAction: createLogger,
  history: createBrowserHistory()
});
app.use(createLoading());

// todo: 2. Plugins
// app.use({});

// todo:  3. Model，注册模型 
app.model(require('./models/counter').default);
app.model(require('./models/user').default);

// todo: 4. Router
app.router(require('./router').default);

// todo: 5. Start
app.start('#root');
