import React, { Component } from 'react'
import cx from 'classnames'

import style from './DepartmentSelectBox.scss'

export default class DepartmentSelectBox extends Component {
  static propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    apiUrlBase: React.PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      departments: [],
      selectedDepartment: null
    }
  }

  handleOnChange(e) {
    e.stopPropagation()
    const departmentHref = this.refs.department.value
    this.state.departments.forEach((department) => {
      if (department._links.self.href === departmentHref) {
        this.props.onSelect(department)
      }
    })

  }

  componentDidMount() {
    const url = this.props.apiUrlBase
    const query = {
      query: '{ departments { id, name} }'
    }
    fetch(url,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query)
      }
    ).then (
      (response) => {
        console.log('departments response:', response)
        return response.json()
      }
    ).then (
      (json) => {
        this.setState({
          departments: json.data.departments,
          selectedDepartment: json.data.departments[0]
        })
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  formatDepartmentName(name) {
    return name.replace(/_/g, ' ');
  }

  render () {
    return (
      <div className={style.departmentSelectBox}>
        <select className={style.select} ref='department' onChange={(e) => this.handleOnChange(e)}>
        {
          this.state.departments.map((department, i) => {
            return <option key={department.name + '_' + i} label={this.formatDepartmentName(department.name)} value={department.id} />
          })
        }
        </select>
      </div>
    )
  }
}
