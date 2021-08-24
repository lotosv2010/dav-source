const SHOW = '@@DVA_LOADING/SHOW'; // 执行saga之前派发的动作
const HIDE = '@@DVA_LOADING/HIDE'; // 执行saga之后派发的动作
const NAMESPACE = 'loading'; // 命名空间

export default function createLoading(options) {
  const initialState = {
    global: false,
    models: {},
    effects: {}
  }
  const extraReducers = {
    [NAMESPACE](state=initialState, {type, payload}) {
      const {namespace, actionType} = payload || {};
      switch (type) {
        case SHOW:
          return {
            ...state,
            global: true,
            models: {
              ...state.models, [namespace]: true
            },
            effects: {
              ...state.effects,
              [actionType]: true
            }
          }
        case HIDE:
          const effects = {...state.effects, [actionType]: false};
          const models = {
            ...state.models,
            [namespace]: Object.keys(effects).some(actionType => {
              const _namespace = actionType.split('/')[0]
              if(_namespace !== namespace) {
                return false;
              }
              return effects[actionType];
            })
          }
          const global = Object.keys(models).some(namespace => {
            return models[namespace];
          })
          return {
            effects,
            models,
            global
          }
        default:
          return state;
      }
    }
  }

  function onEffect(effect, {put}, model, actionType) {
    const {namespace} = model;
    return function *(...args) {
      try {
        yield put({type: SHOW, payload: {namespace, actionType}});
        yield effect(...args);
      } finally {
        yield put({type: HIDE, payload: {namespace, actionType}})
      }
    }
  }

  return {
    onEffect,
    extraReducers
  }
}