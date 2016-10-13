import React, { Component } from 'react'
import cx from 'classnames'

import DepartmentSelectBox from './DepartmentSelectBox'
import style from './AddProductButton.scss'

export default class AddProductButton extends Component {
  static propTypes = {
    onAddProduct: React.PropTypes.func.isRequired,
    apiUrlBase: React.PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      department: {}
    }
  }

  handleClick(e) {
    e.stopPropagation()
    this.props.onAddProduct(this.refs.product.value, this.state.department)
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleClick(e)
    }
  }

  handleSelectDepartment(department) {
    console.log('AddProductButton.handleSelectDepartment:', department)
    this.setState({
      department: department
    })
  }

  render () {
    return (
      <div className={style.addProductButton}>
        <input className={style.input} type='text' ref='product' onClick={(e) => e.stopPropagation()} onKeyPress={(e) => this.handleKeyPress(e)}/>
        <DepartmentSelectBox onSelect={(department) => this.handleSelectDepartment(department)} apiUrlBase={this.props.apiUrlBase}/>
        <span className={style.plus} onClick={(e) => this.handleClick(e)}>+</span>
      </div>
    )
  }
}
