import keymaster from 'keymaster'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
export default {
  namespace: 'counter',
  state: {
    number: 0
  },
  reducers: {
    add(state, action) {
      return { ...state, number: state.number + 1, ...action.payload };
    },
    minus(state, action) {
      return { ...state, number: state.number - 1, ...action.payload };
    }
  },
  subscriptions: {
    keyboard({ dispatch }) {
      keymaster('space', () => { // todo: 监听空格键
        dispatch({type: 'add'})
      })
    },
    changeTitle({ history }) {
      history.listen(({pathname}) => { // todo: 监听路由变化
        document.title = pathname
      })
    }
  },
  effects: {
    *asyncAdd({ payload }, { call, put }) {  // eslint-disable-line
      yield call(delay, 1000)
      yield put({ type: 'add' });
    },
    *asyncMinus({ payload }, { call, put }) {  // eslint-disable-line
      yield call(delay, 1000)
      yield put({ type: 'minus' });
    }
  }
};
