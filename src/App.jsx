import React, { Component } from 'react';

import Menu from './Menu'
import TabPanel from './TabPanel'
import style from './App.scss'


class App extends Component {

  static propTypes = {
    apiUrlBase: React.PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      selectedTab: 'Stores'
    }
  }

  handleMenuClick (e, selectedTab) {
    this.setState({
      selectedTab: selectedTab
    })
  }

  render() {
    return (
      <div className={style.app}>
        <div className={style.appHeader}>
          <h2>GroceryLister 2: The Listering</h2>
        </div>
        <Menu onClick={this.handleMenuClick.bind(this)} />
        <TabPanel selectedTab={this.state.selectedTab}  apiUrlBase={this.props.apiUrlBase} />
      </div>
    )
  }
}

export default App;
