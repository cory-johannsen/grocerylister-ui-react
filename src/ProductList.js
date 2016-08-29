import React, { Component } from 'react'

import './ProductList.css'

class ProductList extends Component {
  static propTypes: {
    apiUrlBase: React.PropTypes.string.required
  }

  constructor () {
    super()
    this.state = {
      payload: {},
      products: [],
      departments: {}
    }
  }

  componentDidMount() {
    let url = this.props.apiUrlBase + "/product?size=1000"
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
          products: json._embedded.product
        })
        this.fetchDepartments(json._embedded.product)
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  fetchDepartments (products) {
    products.map((product) => {
      fetch(product._links.department.href,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then ((response) => {
          return response.json()
        }
      ).then((json) => {
          const departments = this.state.departments
          departments[product._links.department.href] = json
          this.setState({
            departments: departments
          })
        }
      ).catch (
        (err) => {
          console.log(err)
        }
      )
    })
  }

  handleStoreClick(e, product) {
    console.log('Clicked ', product)
  }

  render () {
    return (
      <div className="productList">
        <div className="headerRow">
          <div className="headerRowItem">Product</div>
          <div className="headerRowItem">Department</div>
        </div>
        {
          this.state.products.map (
            (product, i) => {
              const department = this.state.departments[product._links.department.href]
              const departmentName = (department ? department.departmentName : '')
              const productKey = product.name + '_' + i
              return (
                <div className="itemRow"  key={productKey}>
                  <div className="productListItem"
                    onClick={(e) => this.handleStoreClick(e, product.name)}>
                      {product.name}
                  </div>
                  <div className="productListItem">
                      {departmentName}
                  </div>
                </div>
              )
            }
          )
        }
      </div>
    )
  }
}

export default ProductList;
