import React, { Component } from 'react';

import style from './Tab.scss';

class Tab extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
    visible: React.PropTypes.bool.isRequired
  }

  render() {
    return (
      <div className={this.props.visible ? style.tab : style.tabHidden}>
        {this.props.children}
      </div>
    );
  }
}

export default Tab;
