import React, { Component } from 'react';

import Menu from './Menu.js'
import TabPanel from './TabPanel.js'
// import StoreList from './StoreList.js'
import './App.css'


class App extends Component {

  constructor() {
    super()
    this.state = {
      selectedTab: 'Stores'
    }
    this.tabs = [
      {
        id: 'Stores',
        element: 'Stores goes here'
      },
      {
        id: 'Products',
        element: 'Products goes here'
      },
      {
        id: 'Shopping Lists',
        element: 'Shopping Lists goes here'
      }
    ]
  }

  handleMenuClick (e, menuItem) {
    console.log('clicked', menuItem)
    this.setState({
      selectedTab: menuItem
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>GroceryLister 2: The Listering</h2>
        </div>
        <Menu onClick={this.handleMenuClick.bind(this)} />
        <TabPanel tabs={this.tabs} selectedTab={this.state.selectedTab} />
      </div>
    )
  }
}

export default App;
