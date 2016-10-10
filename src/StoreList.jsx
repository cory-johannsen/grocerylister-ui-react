import React, { Component } from 'react'

import style from './StoreList.scss'
import DepartmentList from './DepartmentList'

export default class StoreList extends Component {

  static propTypes = {
    apiUrlBase: React.PropTypes.string.isRequired
  }

  constructor () {
    super()
    this.state = {
      stores: [],
      selectedStore: {}
    }
  }

  componentDidMount() {
    const url = this.props.apiUrlBase
    const query = {
      query: '{ stores { id, name, departments { id, name }} }'
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
        return response.json()
      }
    ).then (
      (json) => {
        this.setState({
          stores: json.data.stores
        })
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  handleStoreClick(e, store) {
    const selectedStore = (store === this.state.selectedStore ? undefined : store)
    this.setState(
      {
        selectedStore
      }
    )
  }

  handleDepartmentMove(department, oldIndex, newIndex) {
    let departments = this.state.selectedStore.departments.slice(0, oldIndex)
      .concat(this.state.selectedStore.departments.slice(oldIndex + 1))
    departments.splice(newIndex, 0, department)

    console.log(departments)
    const {selectedStore} = this.state
    selectedStore.departments = departments
    this.setState(
      {
        selectedStore
      }
    )

    //this.storeDepartments(departments)
  }

  handleAddDepartment(department) {
    if (department && department !== '' && department.trim() !== '') {
      const url = this.props.apiUrlBase
      const query = {
        query: 'mutation addDepartmentToStore($departmentName: String!, $storeId: Int!)' +
          ' { addDepartmentToStore(departmentName: $departmentName, storeId: $storeId)' +
          ' { id, name, departments { id, name} } }',
        variables: {
          departmentName: department,
          storeId: this.state.selectedStore.id
        }
      }
      const body = JSON.stringify(query)
      console.log('query body:', body)

      fetch(url,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: body
        }
      ).then (
        (response) => {
          console.log(response)
          // if (response.status === 409) {
          //   // A department with this name already exists.  Use the existing one.
          //   this.addExistingDepartment(department)
          // }
          // else {
          //   response.json().then (
          //     (json) => {
          //       const departments = this.state.departments;
          //       departments.push(json)
          //       this.setState({
          //         departments: departments
          //       })
          //       this.storeDepartments(departments)
          //     }
          //   )
          // }
        }
      ).catch (
        (err) => {
          console.log(err)
        }
      )
    }
  }

  storeDepartments(departments) {
    const url = this.props.storeUrlBase + '/departments'
    let departmentLinks = []
    departments.map((department) => {
        departmentLinks.push(department._links.self.href)
    })
    const departmentListBody = departmentLinks.join('\n')
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

  render () {
    return (
      <div className={style.storeList}>
        {
          this.state.stores.map (
            (store) => {
              return (
                <div className={style.storeListItem}
                  key={store.id}
                  onClick={(e) => this.handleStoreClick(e, store)}>
                    {store.name}
                    <DepartmentList
                      departments={store.departments}
                      onDepartmentAdd={(department) => this.handleAddDepartment(department)}
                      onDepartmentMove={(department, oldIndex, newIndex) =>
                        this.handleDepartmentMove(department, oldIndex, newIndex)}
                      collapsed={store === this.state.selectedStore}/>
                </div>
              )
            }
          )
        }
      </div>
    )
  }
}
