import React, { Component } from 'react'
import cx from 'classnames'

import style from './AddDepartmentButton.scss'

class AddDepartmentButton extends Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired
  }

  handleClick(e) {
    e.stopPropagation()
    this.props.onClick(this.refs.department.value)
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleClick(e)
    }
  }

  render () {
    return (
      <div className={style.addDepartmentButton}>
        <input className={style.input} type='text' ref='department' onClick={(e) => e.stopPropagation()} onKeyPress={(e) => this.handleKeyPress(e)}/>
        <span className={style.plus} onClick={(e) => this.handleClick(e)}>+</span>
      </div>
    )
  }
}

export default AddDepartmentButton;
