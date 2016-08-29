import React, { Component } from 'react'
import cx from 'classnames'

import './DepartmentList.css'

class DepartmentList extends Component {

  static propTypes: {
    apiUrlBase: React.PropTypes.string.required,
    collapsed: React.PropTypes.bool.required
  }

  constructor () {
    super()
    this.state = {
      payload: {},
      departments: []
    }
  }

  componentDidMount() {
    const url = this.props.apiUrlBase + '/departments'
    fetch(url,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then (
      (response) => {
        return response.json()
      }
    ).then (
      (json) => {
        this.setState({
          payload: json,
          departments: json._embedded.department
        })
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  handleDepartmentClick(e, department) {
    e.stopPropagation();
    console.log('Click! ', e.target)
  }

  handleUpClick(e, department, i) {
    e.stopPropagation();
    if (i > 0) {
      console.log('Moving', department.departmentName, 'at index', i, 'up!')
      // move the item down in the department array
      let departments = this.state.departments.slice(0, i).concat(this.state.departments.slice(i + 1))
      departments.splice(i - 1, 0, department)

      console.log(departments)

      this.setState ({
        departments: departments
      })
      this.storeDepartments(departments)
    }
  }

  handleDownClick(e, department, i) {
    e.stopPropagation();
    if (i < this.state.departments.length - 1) {
      console.log('Moving', department.departmentName, 'at index', i, 'down!')
      let departments = this.state.departments.slice(0, i).concat(this.state.departments.slice(i + 1))
      departments.splice(i + 1, 0, department)

      console.log(departments)

      this.setState ({
        departments: departments
      })
      this.storeDepartments(departments)
    }
  }

  storeDepartments(departments) {
    const url = this.props.apiUrlBase + '/departments'
    let departmentLinks = []
    departments.map((department) => {
        departmentLinks.push(department._links.self.href)
    })
    const departmentListBody = departmentLinks.join('\n')
    console.log(departmentListBody)
    fetch(url,
      {
        method: 'put',
        headers: {
          'Content-Type': 'text/uri-list'
        },
        body: departmentListBody
      }
    ).then (
      (response) => {
        console.log(response)
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  formatDepartmentName(departmentName) {
    return departmentName.replace(/_/g, ' ');
  }

  render () {
    return (
      <div className={this.props.collapsed ? 'departmentList' : 'departmentListCollapsed'} >
        {
          this.state.departments.map (
            (department, i) => {
              const departmentCount = this.state.departments.length;
              return (
                <div className="departmentListRow"key={department.departmentName + '_' + i}>
                  <div className="departmentListItem"
                    onClick={(e) => this.handleDepartmentClick(e, department)}>
                      {this.formatDepartmentName(department.departmentName)}
                  </div>
                  <div className={ i === 0 ? cx("upButton", "disabled") : "upButton" }
                    onClick={(e) => this.handleUpClick(e, department, i)}>&gt;</div>
                  <div className={ i >= (departmentCount - 1) ? cx("downButton", "disabled") : "downButton" }
                    onClick={(e) => this.handleDownClick(e, department, i)}>&gt;</div>
                </div>
              )
            }
          )
        }
      </div>
    )
  }
}

export default DepartmentList;
