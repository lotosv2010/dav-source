import React from 'react';
import { Route, Switch, Link, routerRedux } from './lib/dva/router';
import IndexPage from './routes/IndexPage';
import dynamic from './lib/dva/dynamic';
import {PersistGate} from './lib/redux-persist/integration/react';

const {ConnectedRouter} = routerRedux;

function RouterConfig({ history, app }) {
  const UsersPage = dynamic({
    app,
    models: () => [import(/* webpackChunkName: "users" */'./models/user')],
    component: () => import(/* webpackChunkName: "users" */'./routes/UserPage')
  });
  const persistor = app._store.persistor;
  return (
    <PersistGate persistor={persistor} loading={null}>
      <ConnectedRouter history={history}>
        <>
          <p style={{display: 'flex', justifyContent: 'space-around'}}>
            <Link to='/'>home</Link>
            <Link to='/user'>user</Link>
          </p>
          <Switch>
            <Route path="/" exact component={IndexPage} />
            <Route path="/user" component={UsersPage} />
          </Switch>
        </>
      </ConnectedRouter>
    </PersistGate>
  );
}

export default RouterConfig;
