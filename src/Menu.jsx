import React, { Component } from 'react';
import style from "./Menu.scss"

class MenuItem extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <div className={style.menuItem} onClick={ (e) => this.props.onClick(e, this.props.title) }>{this.props.title}</div>
    );
  }
}

export default class Menu extends Component {

  propTypes: {
    onClick: React.PropTypes.func.required
  }

  render() {
    return (
      <div className={style.menu}>
        <MenuItem title='Stores' onClick={this.props.onClick}/>
        <MenuItem title='Products' onClick={this.props.onClick}/>
        <MenuItem title='Shopping Lists' onClick={this.props.onClick}/>
      </div>
    );
  }
}
