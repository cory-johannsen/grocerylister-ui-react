import React, { Component } from 'react';
import cx from 'classnames'
import style from "./Menu.scss"

class MenuItem extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool.isRequired
  }

  render() {
    return (
      <div className={ this.props.selected ? cx(style.menuItem, style.selected) : style.menuItem } onClick={ () => this.props.onClick(this.props.title) }>{this.props.title}</div>
    )
  }
}

export default class Menu extends Component {

  propTypes: {
    onClick: React.PropTypes.func.required,
    selectedMenuItem: React.PropTypes.string.isRequired
  }

  render() {
    const { onClick, selectedMenuItem} = this.props
    console.log('selectedMenuItem', selectedMenuItem)
    return (
      <div className={style.menu}>
        <MenuItem title='Stores' onClick={onClick} selected={selectedMenuItem === 'Stores'}/>
        <MenuItem title='Products' onClick={onClick} selected={selectedMenuItem === 'Products'}/>
        <MenuItem title='Shopping Lists' onClick={onClick} selected={selectedMenuItem === 'Shopping Lists'}/>
      </div>
    )
  }
}
