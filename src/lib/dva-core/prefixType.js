import { NAMESPACE_SEP } from './constant';

export function prefixType(type, model) {
  if(type.indexOf('/') === -1) {
    return `${model.namespace}${NAMESPACE_SEP}${type}`;
  } else {
    if(type.startsWith(model.namespace)) {
      console.warn(`Waring:[sagaEffects.put] ${type} should not be prefixed with namespace ${model.namespace}`);
    }
  } 
  return type;
}