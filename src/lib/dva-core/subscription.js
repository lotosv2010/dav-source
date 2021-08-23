import prefixedDispatch from './prefixedDispatch';
export function run(app) {
  const {_history: history} = app
  for(const model of app._models) {
    if(model.subscriptions) {
      const {subscriptions} = model;
      for (const key in subscriptions) {
        const subscription = subscriptions[key];
        subscription({
          history,
          dispatch: prefixedDispatch(app._store.dispatch, model)
        });
      }
    }
  }
}