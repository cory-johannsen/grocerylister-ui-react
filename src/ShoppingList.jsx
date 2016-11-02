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

  fetchAllProducts() {
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
        const products = json.data.products
        products.sort((p1, p2) => {
          return p1.name.localeCompare(p2.name)
        })
        this.setState({
          availableProducts: products
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
    const { selectedProducts } = this.state
    selectedProducts.sort((p1, p2) => {
      if (p1.department && p2.department) {
        if (p1.department.name === p2.department.name) {
          return p1.name.localeCompare(p2.name)
        }
        else {
          return p1.department.name.localeCompare(p2.department.name)
        }
      }
      return p1.name.localeCompare(p2.name)
    })
  }

  handleSelectedProductClick(product) {
    console.log("Clicked on selected product", product)
    const url = this.props.apiUrlBase
    const query = {
      query: 'mutation removeProductFromGroceryList($productId: Int!, $groceryListId: Int!)' +
        ' { removeProductFromGroceryList(productId: $productId, groceryListId: $groceryListId)' +
        ' { id, name, products { id, name, department { id, name } } } }',
      variables: {
        productId: product.id,
        groceryListId: this.state.groceryList.id
      }
    }
    const body = JSON.stringify(query)
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
        return response.json()
      }
    ).then (
      (json) => {
        console.log('removeProductFromGroceryList json:', json)
        if (json.data) {
          this.setState({
            groceryList: json.data.removeProductFromGroceryList
          })
        }
        this.sortSelectedProducts()
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  handleAvailableProductClick(product) {
    console.log("Clicked on available product", product)
    // Check for duplicates
    const index = this.state.groceryList.products.findIndex((p) => {
      return p.id === product.id
    })
    if (index >= 0) {
      return
    }
    const url = this.props.apiUrlBase
    const query = {
      query: 'mutation addProductToGroceryList($productId: Int!, $groceryListId: Int!)' +
        ' { addProductToGroceryList(productId: $productId, groceryListId: $groceryListId)' +
        ' { id, name, products { id, name, department { id, name } } } }',
      variables: {
        productId: product.id,
        groceryListId: this.state.groceryList.id
      }
    }
    const body = JSON.stringify(query)
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
        return response.json()
      }
    ).then (
      (json) => {
        console.log('addProductToGroceryList json:', json)
        if (json.data) {
          this.setState({
            groceryList: json.data.addProductToGroceryList
          })
        }
      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
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
                  <input type="checkbox" onChange={() => this.handleSelectedProductClick(product)}/>
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
              return (
                <div className={style.productsListRow} key={'available_' + product.id + '_' + i}>
                  <div className={style.productsListRowItem}>
                    <div className={style.productName} onClick={() => this.handleAvailableProductClick(product)}>
                      {product.name}
                    </div>
                    <div className={style.departmentName} >{product.department.name}</div>
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
