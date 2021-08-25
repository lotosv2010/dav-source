const UNDO = 'UNDO';
const REDO = 'REDO';

export const ActionCreators = {
  undo() {
    return {type: UNDO}
  },
  redo() {
    return {type: REDO}
  }
}

export default function undoable(reducer) {
  const initialState = {
    past: [], // 历史
    present: reducer(undefined, {}), // 当前
    future: [] // 未来
  }
  return function (state=initialState, action) {
    let {past, present, future} = state;
    switch (action.type) {
      case UNDO: // 回退，把历史里最新的那个作为当前，历史减少一个，当前成为未来的第一个，例如  [1,2,3] 4 [5,6] => [1,2] 3 [4,5,6]
        if(past.length === 0) return state
        return {
          past,
          present: past.pop(),
          future: [present, ...future]
        }
      case REDO:
        if(future.length === 0) return state
        return {
          past: [...past, present],
          present: future.shift(),
          future
        }
      default:
        const newPresent = reducer(present, action)
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        }
    }
  }
}