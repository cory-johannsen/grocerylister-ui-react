import React, { Component } from 'react'

import AddProductButton from './AddProductButton'
import style from './ProductList.scss'

export default class ProductList extends Component {
  static propTypes = {
    apiUrlBase: React.PropTypes.string.isRequired
  }

  constructor () {
    super()
    this.state = {
      products: [],
    }
  }

  componentDidMount() {
    const url = this.props.apiUrlBase
    const query = {
      query: '{ products { id, name, department { id, name }} }'
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
        console.log('products response:', response)
        return response.json()
      }
    ).then (
      (json) => {
        this.setState({
          products: json.data.products
        })
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  handleStoreClick(e, product) {
    console.log('Clicked ', product)
  }

  handleSortByProduct() {
    console.log('Sort By Product')
    // const products = this.state.products
    // products.sort((p1, p2) => {
    //   return p1.name.localeCompare(p2.name)
    // })
    // this.setState({
    //   products: products
    // })
  }

  handleSortByDepartment() {
    console.log('Sort By Department')
    // const products = this.state.products
    // products.sort((p1, p2) => {
    //   const department1 = this.state.departments[p1._links.department.href]
    //   const department2 = this.state.departments[p2._links.department.href]
    //   if (department1.name === department2.name) {
    //     return p1.name.localeCompare(p2.name)
    //   }
    //   else {
    //     return department1.name.localeCompare(department2.name)
    //   }
    // })
    // this.setState({
    //   products: products
    // })
  }

  handleAddProduct(product, department) {
    console.log('Add product:', product, 'department:', department)
    if (product && product !== '' && product.trim() !== '') {
      const url = this.props.apiUrlBase + '/product'
      fetch(url,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name: product, department: department._links.self.href})
        }
      ).catch (
        (err) => {
          console.log(err)
        }
      )
    }
  }

  render () {
    return (
      <div className={style.productList}>
        <AddProductButton onAddProduct={(product, department) => this.handleAddProduct(product, department)}
          apiUrlBase={this.props.apiUrlBase} />
        <div className={style.headerRow}>
          <div className={style.headerRowItem} onClick={() => { this.handleSortByProduct() }}>Product</div>
          <div className={style.headerRowItem} onClick={() => { this.handleSortByDepartment() }}>Department</div>
        </div>
        {
          this.state.products.map (
            (product, i) => {
              const productKey = product.name + '_' + i
              return (
                <div className={style.itemRow}  key={productKey}>
                  <div className={style.productListItem}
                    onClick={(e) => this.handleStoreClick(e, product.name)}>
                      {product.name}
                  </div>
                  <div className={style.productListItem}>
                      {product.department.name}
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
