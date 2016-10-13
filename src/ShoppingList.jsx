import React, { Component } from 'react';

import style from './ShoppingList.scss';

export default class ShoppingList extends Component {
  static propTypes = {
    apiUrlBase: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired
  }

  constructor () {
    super()
    this.state = {
      groceryList: {},
      availableProducts: []
    }
  }

  componentDidMount() {
    this.fetchGroceryList()
    this.fetchAllProducts()
  }

  fetchGroceryList() {
    console.log('fetchGroceryList')
    const url = this.props.apiUrlBase
    const query = {
      query: 'query groceryList($storeId: Int!) { groceryList(storeId: $storeId) { id, products { id, name, department {id, name}}}}',
      variables: {
        storeId: this.props.store.id
      }
    }
    fetch(url,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      }
    ).then (
      (response) => {
        return response.json()
      }
    ).then (
      (json) => {
        console.log('fetchGroceryList json', json)
        this.setState({
          groceryList: json.data.groceryList
        })
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
    console.log('fetchAllProducts')
    const url = this.props.apiUrlBase
    const query = {
      query: '{ products { id, name, department { id, name} } }'
    }
    fetch(url,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      }
    ).then (
      (response) => {
        return response.json()
      }
    ).then (
      (json) => {
        console.log('fetchAllProducts json', json)
        this.setState({
          availableProducts: json.data.products
        })
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
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

  renderGroceryList(groceryList) {
    if (groceryList && groceryList.products) {
      return (
        groceryList.products.map((product, i) => {
          const productName = (product && product.name ? product.name : '')
          return (
            <div className={style.productsListRow} key={'selected_' + product.id + '_' + i}>
              <div className={style.productsListRowItem}>
                <div className={style.productName}>
                  <input type="checkbox" onChange={() => this.handleSelectedProductClick(product, i)}/>
                  {product.name}
                </div>
                <div>{product.department.name}</div>
              </div>
            </div>
          )
        })
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }

  render() {
    const { groceryList, availableProducts } = this.state
    console.log('groceryList', groceryList)
    console.log('availableProducts', availableProducts)
    return (
      <div className={style.shoppingList}>
        <div className={style.selectedProducts}>
          {
            this.renderGroceryList(groceryList)
          }
        </div>

        Available:
        <div className={style.availableProducts}>
          {
            availableProducts.map((product, i) => {
              const productName = (product && product.name ? product.name : '')
              return (
                <div className={style.productsListRow} key={'available_' + product.id + '_' + i}>
                  <div className={style.productsListRowItem}>
                    <div className={style.productName}>
                      <input type="checkbox" onChange={() => this.handleAvailableProductClick(product, i)}/>
                      {productName}
                    </div>
                    <div>{product.department.name}</div>
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
