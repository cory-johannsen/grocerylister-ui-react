import React, { Component } from 'react';

import './Tab.css';

class Tab extends Component {
  propTypes: {
    id: React.PropTypes.string.required,
    children: React.PropTypes.element.required,
    visible: React.PropTypes.bool.required
  }

  render() {
    return (
      <div className={this.props.visible ? 'tab' : 'tabHidden'}>
        {this.props.children}
      </div>
    );
  }
}

export default Tab;
