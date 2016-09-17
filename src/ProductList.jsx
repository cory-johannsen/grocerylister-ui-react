import React, { Component } from 'react'

import AddProductButton from './AddProductButton'
import style from './ProductList.scss'

class ProductList extends Component {
  static propTypes = {
    apiUrlBase: React.PropTypes.string.isRequired
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

  handleAddProduct(product, department) {
    console.log('Add product:', product, 'department:', department)
  }

  render () {
    return (
      <div className={style.productList}>
        <AddProductButton onAddProduct={(product, department) => this.handleAddProduct(product, department)}
          apiUrlBase={this.props.apiUrlBase} />
        <div className={style.headerRow}>
          <div className={style.headerRowItem}>Product</div>
          <div className={style.headerRowItem}>Department</div>
        </div>
        {
          this.state.products.map (
            (product, i) => {
              const department = this.state.departments[product._links.department.href]
              const name = (department ? department.name : '')
              const productKey = product.name + '_' + i
              return (
                <div className={style.itemRow}  key={productKey}>
                  <div className={style.productListItem}
                    onClick={(e) => this.handleStoreClick(e, product.name)}>
                      {product.name}
                  </div>
                  <div className={style.productListItem}>
                      {name}
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
