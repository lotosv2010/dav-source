import React from 'react';
import { connect } from '../lib/dva';
import styles from './IndexPage.css';
import {routerRedux} from '../lib/dva/router';
import {ActionCreators} from '../lib/redux-undo';

function IndexPage(props) {
  const {counter: {number}, dispatch, loading: {models}} = props
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Counter</h1>
      <div className={styles.welcome}>number: {models.counter?<span>执行中....</span>: number}</div>
      <p><button onClick={() => dispatch({type: 'counter/add'})}>+</button></p>
      <p><button onClick={() => dispatch({type: 'counter/minus'})}>-</button></p>
      <p><button disabled={models.counter} onClick={() => dispatch({type: 'counter/asyncAdd'})}>+(async)</button></p>
      <p><button disabled={models.counter} onClick={() => dispatch({type: 'counter/asyncMinus'})}>-(async)</button></p>
      <p><button onClick={() => dispatch(routerRedux.push('/user'))}>goto user</button></p>
      <p><button onClick={() => dispatch({type: 'counter/@@CANCEL_EFFECTS'})}>取消effect</button></p>
      <p><button onClick={() => dispatch(ActionCreators.undo())}>撤销</button></p>
      <p><button onClick={() => dispatch(ActionCreators.redo())}>重做</button></p>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect((state) => ({
  ...state.present
}))(IndexPage);
