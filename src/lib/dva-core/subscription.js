import prefixedDispatch from './prefixedDispatch';

export function runSubscription(subscriptions={}, app, plugin) {
  for (const key in subscriptions) {
    const subscription = subscriptions[key];
    subscription({
      history: app._history,
      dispatch: prefixedDispatch(app._store.dispatch, app.model)
    }, error => {
      const onError = plugin.get('onError');
      onError.forEach(fn => {
        fn(error);
      });
    });
  }
}


export function run(app, plugin) {
  for(const model of app._models) {
    if(model.subscriptions) {
      const {subscriptions} = model;
      runSubscription(subscriptions, app, plugin)
    }
  }
}