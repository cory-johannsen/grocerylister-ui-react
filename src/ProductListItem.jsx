import React, { Component } from 'react'

import style from './ProductListItem.scss'

export default class ProductListItem extends Component {
  static propTypes = {
    apiUrlBase: React.PropTypes.string.isRequired,
    product: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func.isRequired
  }

  handleStoreClick(e, product) {
    this.state.onEdit(product)
  }

  render() {
    return (
      <div className={style.productListItem}>
        <div>
            {this.props.product.name}
        </div>
        <div className={style.controls}>
          <div className={style.department}>
              {this.props.product.department.name}
          </div>
          <div className={style.buttons}>
            <div className={style.edit}></div>
            <div className={style.delete}></div>
          </div>
        </div>
      </div>
    )
  }
}
