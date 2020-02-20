import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import DialogWithButton from '@bit/amazingdesign.react-redux-mui-starter.dialog-with-button'

import CartContent from '../CartContent'
import CartButton from './CartButton'

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      width: '100%',
      maxWidth: 'none !important',
    },
  },
}))

const Cart = ({
  tooltip,
  items,
  closeLabel,
  removeItem,
  addItem,
  buttonLabel,
  buttonClick,
  defaultCurrency,
  emptyCartMessage,
}) => {
  const classes = useStyles()

  return (
    <DialogWithButton
      open={false}
      label={'Cart'}
      dialogProps={{
        classes,
        closeLabel,
        fullScreen: false,
      }}
      closeDialogProp={'buttonClick'}
      buttonComponent={({ fullWidth, ...otherProps }) => (
        <CartButton
          itemsCount={items.length || 0}
          tooltip={tooltip}
          {...otherProps}
        />
      )}
    >
      <CartContent
        items={items}
        removeItem={removeItem}
        addItem={addItem}
        buttonLabel={buttonLabel}
        defaultCurrency={defaultCurrency}
        emptyCartMessage={emptyCartMessage}
        buttonClick={buttonClick}
      />
    </DialogWithButton>
  )
}

Cart.propTypes = {
  tooltip: PropTypes.node,
  closeLabel: PropTypes.string,
  buttonLabel: PropTypes.string,
  defaultCurrency: PropTypes.string,
  emptyCartMessage: PropTypes.string,
  items: PropTypes.array,
  removeItem: PropTypes.func,
  addItem: PropTypes.func,
  buttonClick: PropTypes.func,
}

export default Cart