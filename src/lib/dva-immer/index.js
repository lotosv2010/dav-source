import produce from 'immer';

export default function() {
  return {
    _handleActions(reducers, defaultState) {
      return function (state = defaultState, action) {
        const {type} = action;
        const ret = produce(state, draft => {
          const reducer = reducers[type];
          if(reducer) {
            return reducer(draft, action);
          }
        });
        return ret || {};
      }
    }
  }
}
