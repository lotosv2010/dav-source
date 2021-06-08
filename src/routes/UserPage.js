import React from 'react'
import { connect } from 'dva'

export const User = (props) => {
  console.log(props)
  const {user: {name, age}, dispatch} = props
  return (
    <div style={{textAlign: 'center'}}>
      <p>name: {name}</p>
      <p>age: {age}</p>
      <p><button onClick={() => dispatch({type: 'user/setName'})}>设置姓名</button></p>
      <p><button onClick={() => dispatch({type: 'user/setAge'})}>设置年龄</button></p>
    </div>
  )
}

const mapStateToProps = (state) => ({
  ...state
})

export default connect(mapStateToProps)(User)
