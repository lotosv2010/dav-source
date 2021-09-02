import { prefixType } from './prefixType';

export default function prefixedDispatch(dispatch, model) {
  return action => {
    const { type } = action;
    return dispatch({ ...action, type: prefixType(type, model) });
  };
}