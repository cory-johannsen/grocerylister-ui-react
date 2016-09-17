import React, { Component } from 'react'
import cx from 'classnames'

import style from './DepartmentSelectBox.scss'

class DepartmentSelectBox extends Component {
  static propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    apiUrlBase: React.PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      departments: []
    }
  }

  handleSelect(e) {
    e.stopPropagation()
    this.props.onSelect(this.refs.department.value)
  }

  componentDidMount() {
    const url = this.props.apiUrlBase + '/department?size=1000'
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
          departments: json._embedded.department
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
        <select className={style.select} ref='department' onSelect={(e) => this.handleSelect(e)}>
        {
          this.state.departments.map((department) => {
            return <option label={this.formatDepartmentName(department.name)} value={department._links.self.href} />
          })
        }
        </select>
      </div>
    )
  }
}

export default DepartmentSelectBox;
