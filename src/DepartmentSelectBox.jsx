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
    const departmentId = parseInt(this.refs.department.value)
    this.state.departments.forEach((department) => {
      if (department.id === departmentId) {
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
        this.props.onSelect(json.data.departments[0])
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  render () {
    return (
      <div className={style.departmentSelectBox}>
        <select className={style.selection} ref='department' onChange={(e) => this.handleOnChange(e)}>
        {
          this.state.departments.map((department, i) => {
            return <option key={department.id + '_' + i} label={department.name} value={department.id} />
          })
        }
        </select>
      </div>
    )
  }
}
