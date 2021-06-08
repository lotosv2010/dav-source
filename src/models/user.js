export default {
  namespace: 'user',
  state: {
    name: 'test',
    age: 0
  },
  reducers: {
    setName(state, action) {
      return { ...state, name: state.name + 1, ...action.payload };
    },
    setAge(state, action) {
      return { ...state, age: state.age + 1, ...action.payload };
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'setName' });
    },
  }
};
