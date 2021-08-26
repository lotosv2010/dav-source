function persistStore(store) {
  const persistor = {
    ...store,
    initialize() {
      store.dispatch({type: 'PERSIST_INIT'})
    },
    save() {
      store.dispatch({type: 'PERSIST_SAVE'})
    }
  }
  return persistor;
}
export default persistStore;