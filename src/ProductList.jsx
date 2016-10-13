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
    const products = this.state.products
    products.sort((p1, p2) => {
      return p1.name.localeCompare(p2.name)
    })
    this.setState({
      products: products
    })
  }

  handleSortByDepartment() {
    console.log('Sort By Department')
    const products = this.state.products
    products.sort((p1, p2) => {
      if (p1.department.name === p2.department.name) {
        return p1.name.localeCompare(p2.name)
      }
      else {
        return p1.department.name.localeCompare(p2.department.name)
      }
    })
    this.setState({
      products: products
    })
  }

  handleAddProduct(product, department) {
    console.log('Add product:', product, 'department:', department)
    if (product && product !== '' && product.trim() !== '') {
      const url = this.props.apiUrlBase
      const query = {
        query: 'mutation addProduct($name: String!, $departmentId: Int!)' +
          ' { addProduct(name: $name, departmentId: $departmentId)' +
          ' { id, name, department { id, name } } }',
        variables: {
          name: product,
          departmentId: department.id
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
          if (response.status != 200) {
            console.log('Error adding product:', response)
          }
          else {
            return response.json()
          }
        }
      ).then(
        (json) => {
          console.log('handleAddProduct processing json:', json)
          if(json.data) {
            const { products } = this.state
            const newProduct = json.data.addProduct
            let found = false
            products.forEach((p) => {
              if (p.id === newProduct.id) {
                found = true
              }
            })
            if (!found) {
              // will occur when adding a product that already exists
              products.push(newProduct)
            }

            this.setState({
              products: products
            })
          }
          else if (json.errors) {
            console.log('handleAddProduct processing json:', json.errors)
          }
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
