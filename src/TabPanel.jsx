import React, { Component } from 'react';

import Tab from './Tab'
import StoreList from './StoreList'
import ProductList from './ProductList'
import ShoppingListContainer from './ShoppingListContainer'
import style from './TabPanel.scss';


export default class TabPanel extends Component {

  static propTypes = {
    selectedTab: React.PropTypes.string.isRequired,
    apiUrlBase: React.PropTypes.string.isRequired
  }

  render() {
    return (
      <div className={style.tabPanel}>
        <Tab id='Stores' visible={this.props.selectedTab === 'Stores'}><StoreList apiUrlBase={this.props.apiUrlBase} /></Tab>
        <Tab id='Products' visible={this.props.selectedTab === 'Products'}><ProductList apiUrlBase={this.props.apiUrlBase} /></Tab>
        <Tab id='Shopping Lists' visible={this.props.selectedTab === 'Shopping Lists'}><ShoppingListContainer apiUrlBase={this.props.apiUrlBase} /></Tab>
      </div>
    );
  }
}
