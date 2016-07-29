import React, { Component } from 'react';

import './AppContent.css';


class AppContent extends Component {

  propTypes: {
    children: React.PropTypes.element.required
  }

  render() {
    return (
      <div className="AppContent">
        {this.props.children}
      </div>
    )
  }
}

export default AppContent;
