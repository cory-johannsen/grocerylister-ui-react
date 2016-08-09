import React, { Component } from 'react';

import Tab from './Tab.js'
import StoreList from './StoreList.js'
import ProductList from './ProductList.js'
import './TabPanel.css';


class TabPanel extends Component {

  static propTypes: {
    children: React.PropTypes.element.required,
    selectedTab: React.PropTypes.string.required,
    apiUrlBase: React.PropTypes.string.required
  }

  render() {
    return (
      <div className="tabPanel">
        <Tab id='Stores' visible={this.props.selectedTab === 'Stores'}><StoreList apiUrlBase={this.props.apiUrlBase}/></Tab>
        <Tab id='Products' visible={this.props.selectedTab === 'Products'}><ProductList apiUrlBase={this.props.apiUrlBase}/></Tab>
        <Tab id='Shopping Lists' visible={this.props.selectedTab === 'Shopping Lists'}>Shopping Lists go here</Tab>

      </div>
    );
  }
}

export default TabPanel;
