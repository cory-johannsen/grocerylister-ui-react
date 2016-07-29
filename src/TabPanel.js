import React, { Component } from 'react';

import './TabPanel.css';

class Tab extends Component {
  propTypes: {
    children: React.PropTypes.element.required,
    visible: React.PropTypes.bool.required
  }

  render() {
    return (
      <div className={this.props.visible ? 'Tab' : 'Tab-hidden'}>
        {this.props.children}
      </div>
    );
  }
}

class TabPanel extends Component {

  propTypes: {
    tabs: React.PropTypes.array.required,
    selectedTab: React.PropTypes.string.required
  }

  render() {
    return (
      <div className="TabPanel">
        {
          this.props.tabs.map( (tab) =>
            {
              if (tab.id === this.props.selectedTab) {
                return (
                    <Tab key={tab.id} children={tab.element} visible={this.props.selectedTab === tab.id} />
                )
              }
            }
          )
        }
      </div>
    );
  }
}

export default TabPanel;
