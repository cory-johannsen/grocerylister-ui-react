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
      selectedStore: ''
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
        selectedStore: selectedStore
      }
    )
  }

  render() {
    return (
      <div className={style.shoppingListContainer}>
        {
          this.state.stores.map (
            (store) => {
              return (
                <div className={storeStyle.storeListItem}
                  key={store.name}
                  onClick={(e) => this.handleStoreClick(e, store.name)}>
                    {store.name}
                  <ShoppingList apiUrlBase={this.props.apiUrlBase}
                    store={store}
                    collapsed={store.name === this.state.selectedStore}/>
                </div>
              )
            }
          )
        }
      </div>
    );
  }
}
