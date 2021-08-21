import {NAMESPACE_SEP} from './constant';

// 将reducers对象的属性名从add变为counter/add
function prefixNamespace(model) {
  const reducers = model.reducers;
  model.reducers = Object.keys(reducers).reduce((memo, key) => {
    const newKey = `${model.namespace}${NAMESPACE_SEP}${key}`;
    memo[newKey] = reducers[key];
    return memo;
  }, {})
  return model
}
export default prefixNamespace;