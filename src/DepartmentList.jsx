import React, { Component } from 'react'
import cx from 'classnames'

import AddDepartmentButton from './AddDepartmentButton'
import style from './DepartmentList.scss'

export default class DepartmentList extends Component {

  static propTypes = {
    departments: React.PropTypes.array.isRequired,
    onDepartmentMove: React.PropTypes.func.isRequired,
    onDepartmentAdd: React.PropTypes.func.isRequired,
    collapsed: React.PropTypes.bool.isRequired
  }

  handleDepartmentClick(e, department) {
    e.stopPropagation();
    console.log('Click! ', e.target)
  }

  handleUpClick(e, department, i) {
    e.stopPropagation();
    if (i > 0) {
      console.log('Moving', department.name, 'at index', i, 'up!')
      this.props.onDepartmentMove(department, i, i - 1)
    }
  }

  handleDownClick(e, department, i) {
    e.stopPropagation();
    if (i < this.props.departments.length - 1) {
      console.log('Moving', department.name, 'at index', i, 'down!')
      this.props.onDepartmentMove(department, i, i + 1)
    }
  }

  handleAddDepartmentClick(department) {
    this.props.onDepartmentAdd(department)
  }

  formatDepartmentName(name) {
    return name.replace(/_/g, ' ');
  }

  render () {
    return (
      <div className={this.props.collapsed ? style.departmentList : style.departmentListCollapsed} >
        {
          this.props.departments.map (
            (department, i) => {
              const departmentCount = this.props.departments.length;
              return (
                <div className= {style.departmentListRow} key={department.name + '_' + i}>
                  <div className={style.departmentListItem}
                    onClick={(e) => this.handleDepartmentClick(e, department)}>
                      {this.formatDepartmentName(department.name)}
                  </div>
                  <div className={ i === 0 ? cx(style.upButton, style.disabled) : style.upButton }
                    onClick={(e) => this.handleUpClick(e, department, i)}>&gt;</div>
                  <div className={ i >= (departmentCount - 1) ? cx(style.downButton, style.disabled) : style.downButton }
                    onClick={(e) => this.handleDownClick(e, department, i)}>&gt;</div>
                </div>
              )
            }
          )
        }
        <AddDepartmentButton onClick={(department) => this.handleAddDepartmentClick(department)} />
      </div>
    )
  }
}
