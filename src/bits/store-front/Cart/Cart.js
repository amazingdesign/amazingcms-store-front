import React from 'react'
import PropTypes from 'prop-types'

import DialogWithButton from '@bit/amazingdesign.react-redux-mui-starter.dialog-with-button'

import CartInner from './CartInner'
import CartButton from './CartButton'

const Cart = ({ tooltip, itemsCount, closeLabel }) => (
  <DialogWithButton
    label={'Cart'}
    dialogProps={{ closeLabel }}
    closeDialogProp={'onClose'}
    buttonComponent={(props) => <CartButton
      itemsCount={itemsCount}
      tooltip={tooltip} {...props}
    />}
  >
    <CartInner />
  </DialogWithButton>
)

Cart.propTypes = {
  tooltip: PropTypes.node,
  closeLabel: PropTypes.string,
  itemsCount: PropTypes.number,
}

export default Cart