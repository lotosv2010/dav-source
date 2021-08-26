/**
 * todo：函数的作用
 * 1、派发动作的时候，要负责把新的状态持久化到存储空间里
 * 2、可以从存储空间中加载初始化的数据传给仓库
 * @param {*} persistConfig 
 * @param {*} reduces 
 */
function persistReducer(persistConfig, reduces) {
  let initialized = false; //是否已经初始化过，就是从localStorage里拿到数据并填充到仓库中
  const key = `persist:${persistConfig.key}`;
  const {whitelist=[], blacklist=[]} = persistConfig;
  return function(state, action) {
    if (action.type === 'PERSIST_INIT') {
      initialized = true;
      let value =  persistConfig.storage.get(key);
      state = value?JSON.parse(value):undefined;
      return reduces(state, action);
    }
    if (action.type === 'PERSIST_SAVE') {
      if (initialized) {
        persistConfig.storage.set(key, JSON.stringify(state))
        return state;
      }
    }
    if (initialized) {
      const savedState = {}
      state = reduces(state, action);
      for (const key in state) {
        if (whitelist.includes(key)) {
          savedState[key] = state[key];
        }
        if(!blacklist.includes(key)) {
          savedState[key] = state[key];
        }
      }
      persistConfig.storage.set(key, JSON.stringify(savedState))
      return state;
    }
    return reduces(state, action);
  }
}
export default persistReducer;