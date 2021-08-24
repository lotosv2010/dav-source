const hooks = [
  'onEffect', // 增强effect
  'extraReducers', // 添加额外的reducer
  'onAction'
]

export default class Plugin {
  constructor() {
    // this.hooks = {onEffect: [], extractReducers: []}
    this.hooks = hooks.reduce((memo, key) => {
      memo[key] = []
      return memo;
    }, {})
  }
  // 插件就是一个对象，他的属性就是钩子函数
  use(plugin) {
    const {hooks} = this;
    for (const key in plugin) {
      hooks[key].push(plugin[key]);
    }
  }
  get(key) {
    const {hooks} = this;
    if(key === 'extraReducers') return getExtractReducers(hooks[key]); // hooks[key] => 数组 [{key1: reducer1, key2: reducer2}]
    return hooks[key];
  }
}

function getExtractReducers(hook) {
  let ret = {};
  for (const reducerObject of hook) {
    ret = {...ret, ...reducerObject}
  }
  return ret;
}

/**
 * 把不是hooks的属性去掉
 */
export function filterHooks(options) {
  return Object.keys(options).reduce((memo, key) => {
    if(hooks.includes(key)) {
      memo[key] = options[key];
    }
    return memo;
  }, {})
}