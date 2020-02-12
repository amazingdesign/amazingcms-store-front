import React from 'react'
import PropTypes from 'prop-types'

import DialogWithButton from '@bit/amazingdesign.react-redux-mui-starter.dialog-with-button'

import CartContent from '../CartContent'
import CartButton from './CartButton'

const Cart = ({ tooltip, items, closeLabel, removeItem, addItem, buttonLabel, defaultCurrency, emptyCartMessage }) => (
  <DialogWithButton
    open={false}
    label={'Cart'}
    dialogProps={{ closeLabel }}
    closeDialogProp={'onClose'}
    buttonComponent={({ fullWidth, ...otherProps }) => <CartButton
      itemsCount={items.length || 0}
      tooltip={tooltip}
      {...otherProps}
    />}
  >
    <CartContent
      items={items}
      removeItem={removeItem}
      addItem={addItem}
      buttonLabel={buttonLabel}
      defaultCurrency={defaultCurrency}
      emptyCartMessage={emptyCartMessage}
    />
  </DialogWithButton>
)

Cart.propTypes = {
  tooltip: PropTypes.node,
  closeLabel: PropTypes.string,
  buttonLabel: PropTypes.string,
  defaultCurrency: PropTypes.string,
  emptyCartMessage: PropTypes.string,
  items: PropTypes.array,
  removeItem: PropTypes.func,
  addItem: PropTypes.func,
}

export default Cart