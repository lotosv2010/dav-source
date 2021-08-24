import React from 'react';
import { Route, Switch, Link, routerRedux } from './lib/dva/router';
import IndexPage from './routes/IndexPage';
import UserPage from './routes/UserPage'
const {ConnectedRouter} = routerRedux;

function RouterConfig({ history, app }) {
  return (
    <ConnectedRouter history={history}>
      <>
        <p style={{display: 'flex', justifyContent: 'space-around'}}>
          <Link to='/'>home</Link>
          <Link to='/user'>user</Link>
        </p>
        <Switch>
          <Route path="/" exact component={IndexPage} />
          <Route path="/user" component={UserPage} />
        </Switch>
      </>
    </ConnectedRouter>
  );
}

export default RouterConfig;
