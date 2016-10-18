import React, { Component } from 'react';

import ShoppingList from './ShoppingList'
import style from './ShoppingListContainer.scss'
import storeStyle from './StoreList.scss'

export default class ShoppingListContainer extends Component {
  static propTypes = {
    apiUrlBase: React.PropTypes.string.isRequired
  }

  constructor () {
    super()
    this.state = {
      stores: [],
      selectedStore: undefined
    }
  }

  componentDidMount() {
    const url = this.props.apiUrlBase
    const query = {
      query: '{ stores { id, name }}'
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
        let {selectedStore} = this.state
        if (!selectedStore) {
          selectedStore = json.data.stores[0]
        }
        this.setState({
          stores: json.data.stores,
          selectedStore: selectedStore
        })

      }
    ).catch (
      (err) => {
        console.log(err)
      }
    )
  }

  handleStoreClick(e, store) {
    console.log('ShoppingListContainer.handleStoreClick:', e, store)
    if (store === this.state.selectedStore) {
      this.setState(
        {
          selectedStore: null
        }
      )
    }
    else {
      this.setState(
        {
          selectedStore: store
        }
      )
    }
  }

  renderShoppingList(store) {
    const {selectedStore} = this.state
    if (selectedStore && store.id === selectedStore.id) {
      return (
        <ShoppingList apiUrlBase={this.props.apiUrlBase}
          store={store}/>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }

  render() {
    return (
      <div className={style.shoppingListContainer}>
        {
          this.state.stores.map (
            (store) => {
              const shoppingList = this.renderShoppingList(store)
              return (
                <div className={storeStyle.storeListItem}
                  key={store.id}>
                    <span onClick={(e) => this.handleStoreClick(e, store)}>
                    { store.name }
                    </span>
                    { shoppingList }
                </div>
              )
            }
          )
        }
      </div>
    );
  }
}
