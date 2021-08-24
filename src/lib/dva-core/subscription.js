import prefixedDispatch from './prefixedDispatch';

export function runSubscription(subscriptions={}, app) {
  for (const key in subscriptions) {
    const subscription = subscriptions[key];
    subscription({
      history: app._history,
      dispatch: prefixedDispatch(app._store.dispatch, app.model)
    });
  }
}


export function run(app) {
  for(const model of app._models) {
    if(model.subscriptions) {
      const {subscriptions} = model;
      runSubscription(subscriptions, app)
    }
  }
}