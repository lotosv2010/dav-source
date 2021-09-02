import * as sagaEffects from 'redux-saga/effects';
import {prefixType} from './prefixType';

export function getSaga(effects, model, onEffect, onError) {
  return function *() {
    for (const key in effects) {
      const watcher = getWatcher(key, model.effects[key], model, onEffect, onError);
      // 为什么要调用fork，因为fork可单独开一个进程执行，而不阻塞当前sage执行
      const task = yield sagaEffects.fork(watcher);
      yield sagaEffects.fork(function*() {
        yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`);
        yield sagaEffects.cancel(task);
      });
    }
  }
}

export function getSagas(app, plugin) {
  const sages = []
  for (const model of app._models) {
    // 把 effects对象变成一个saga
    sages.push(getSaga(model.effects, model, plugin.get('onEffect'), plugin.get('onError')))
  }
  return sages;
}

function getWatcher(key, effect, model, onEffect, onError) {
  function put(action) {
    const {type} = action;
    return sagaEffects.put({...action, type: prefixType(type, model)})
  }

  return function * () {
    if(onEffect) {
      for (const fn of onEffect) {
        effect = fn(effect, { ...sagaEffects, put}, model, key);
      }
    }
    yield sagaEffects.takeEvery(key, function * (...args) {
      try {
        yield effect(...args, { ...sagaEffects, put});
      } catch (e) {
        onError.forEach(fn => fn(e))
      }
    });
  }
}