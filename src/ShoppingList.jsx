import React, { Component } from 'react';

import style from './ShoppingList.scss';

export default class ShoppingList extends Component {
  static propTypes = {
    apiUrlBase: React.PropTypes.string.isRequired,
    groceryListUrl: React.PropTypes.string.isRequired
  }

  constructor () {
    super()
    this.state = {
      groceryList: {},
      availableProducts: [],
      selectedProducts: [],
      departments: []
    }
  }

  componentDidMount() {
    this.fetchGroceryList()
    this.fetchAllProducts()
  }

  fetchGroceryList() {
    const url = this.props.groceryListUrl
    fetch(url,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then (
      (response) => {
        if (response.status === 200) {
          response.json().then (
            (json) => {
              this.setState({
                groceryList: json
              })
              this.fetchSelectedProducts();
            }
          )
        }
        else {
          console.log(response)
        }
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  fetchSelectedProducts() {
    console.log('fetchSelectedProducts')
    const url = this.state.groceryList._links.products.href
    fetch(url,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then (
      (response) => {
        if (response.status === 200) {
          response.json().then (
            (json) => {
              console.log('fetched', json._embedded.product.length,'selected products')
              this.setState({
                selectedProducts: json._embedded.product
              })
              this.sortSelectedProducts();
            }
          )
        }
        else {
          console.log(response)
        }
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  storeSelectedProducts() {
    let productLinks = []
    const { selectedProducts } = this.state
    selectedProducts.map((product) => {
        productLinks.push(product._links.self.href)
    })
    console.log("Storing", productLinks.length, "products")
    const url = this.state.groceryList._links.products.href
    fetch(url,
      {
        method: 'put',
        headers: {
          'Content-Type': 'text/uri-list'
        },
        body: productLinks.join('\n')
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  fetchAllProducts() {
    const url = this.props.apiUrlBase + "/product?size=1000&sort=name&name.dir=desc"
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
          availableProducts: json._embedded.product
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

  sortSelectedProducts() {
    console.log('sortSelectedProducts')
    const { selectedProducts, departments } = this.state
    selectedProducts.sort((p1, p2) => {
      const department1 = departments[p1._links.department.href]
      const department2 = departments[p2._links.department.href]
      if (department1 && department2) {
        if (department1.name === department2.name) {
          return p1.name.localeCompare(p2.name)
        }
        else {
          return department1.name.localeCompare(department2.name)
        }
      }
      return p1.name.localeCompare(p2.name)
    })
  }

  sortAvailableProducts() {
    const { availableProducts } = this.state
    availableProducts.sort((p1, p2) => {
      return p1.name.localeCompare(p2.name)
    })
  }

  handleSelectedProductClick(product, index) {
    console.log("Clicked on selected product", product)
    const { selectedProducts, availableProducts } = this.state
    selectedProducts.splice(index, 1)
    this.sortSelectedProducts()
    availableProducts.push(product)
    this.sortAvailableProducts()
    this.setState(
      {
        selectedProducts,
        availableProducts
      }
    )
    this.storeSelectedProducts()
  }

  handleAvailableProductClick(product, index) {
    console.log("Clicked on available product", product)
    const { selectedProducts, availableProducts } = this.state
    selectedProducts.push(product)
    this.sortSelectedProducts()
    availableProducts.splice(index, 1)
    this.sortAvailableProducts()
    this.setState(
      {
        selectedProducts,
        availableProducts
      }
    )
    this.storeSelectedProducts()
  }

  render() {
    const { selectedProducts, availableProducts, departments } = this.state
    return (
      <div className={style.shoppingList}>
        <div className={style.selectedProducts}>
          {
            selectedProducts.map((product, i) => {
              const department = departments[product._links.department.href]
              const departmentName = (department ? department.name : '')
              const productName = (product && product.name ? product.name : '')
              return (
                <div className={style.productsListRow} key={'selected_' + product.name + '_' + i}>
                  <div className={style.productsListRowItem}>
                    <div className={style.productName}>
                      <input type="checkbox" onChange={() => this.handleSelectedProductClick(product, i)}/>
                      {product.name}
                    </div>
                    <div>{departmentName}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
        Available:
        <div className={style.availableProducts}>
          {
            availableProducts.map((product, i) => {
              const department = departments[product._links.department.href]
              const departmentName = (department ? department.name : '')
              const productName = (product && product.name ? product.name : '')
              return (
                <div className={style.productsListRow} key={'available_' + productName + '_' + i}>
                  <div className={style.productsListRowItem}>
                    <div className={style.productName}>
                      <input type="checkbox" onChange={() => this.handleAvailableProductClick(product, i)}/>
                      {productName}
                    </div>
                    <div>{departmentName}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}
