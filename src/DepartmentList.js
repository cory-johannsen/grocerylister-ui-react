import React, { Component } from 'react'

import './DepartmentList.css'

class DepartmentList extends Component {

  propTypes: {
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

  handleDepartmentClick(e) {
    console.log('Click! ', e.target)
  }

  render () {
    return (
      <div className={this.props.collapsed ? 'departmentList' : 'departmentListCollapsed'} >
        {
          this.state.departments.map (
            (department) => {
              return <div className="departmentListItem" key={department.departmentName}
                  onClick={(e) => this.handleDepartmentClick(e)}>{department.departmentName}</div>
            }
          )
        }
      </div>
    )
  }
}

export default DepartmentList;
