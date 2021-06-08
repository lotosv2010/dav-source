import React from 'react';
import { Router, Route, Switch, Link } from 'dva/router';
import IndexPage from './routes/IndexPage';
import UserPage from './routes/UserPage'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
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
    </Router>
  );
}

export default RouterConfig;
