import React from 'react'
import PropTypes from 'prop-types'

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Chip,
  Button,
} from '@material-ui/core'
import { Add, Remove } from '@material-ui/icons'

import IconMessage from '@bit/amazingdesign.react-redux-mui-starter.icon-message'

const CartContent = ({ items, removeItem, addItem, buttonLabel = 'Pay ', defaultCurrency = '$', emptyCartMessage }) => {
  const cartTotal = items.reduce(
    (r, { price, quantity }) => r + price * (quantity || 0),
    0
  )
  return (
    items.length < 1 ?
      <IconMessage
        icon={'remove_shopping_cart'}
        subMessage={emptyCartMessage}
      />
      :
      <>
        <List>
          {
            items && items.map((item) => {
              const { id, name, photo, quantity, price, currency } = item
              const itemTotal = (quantity || 1) * price
              const displayedCurrency = currency || defaultCurrency
              return (
                <ListItem key={id}>
                  <ListItemAvatar>
                    <Avatar
                      style={{ borderRadius: 0 }}
                      src={photo}
                      alt={`${name}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${name}`}
                    secondary={`${price}${quantity > 1 ? ` x ${quantity} = ${itemTotal}` : ''} ${displayedCurrency}`}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={`${itemTotal} ${displayedCurrency}`}
                      variant={'outlined'}
                    />
                    <IconButton onClick={() => removeItem(item)}>
                      <Remove />
                    </IconButton>
                    <IconButton onClick={() => addItem(item)}>
                      <Add />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })
          }
        </List>
        <Button
          variant={'contained'}
          color={'primary'}
          fullWidth={true}
        >
          {buttonLabel} {cartTotal} {defaultCurrency}
        </Button>
      </>
  )
}

CartContent.propTypes = {
  items: PropTypes.array,
  removeItem: PropTypes.func,
  addItem: PropTypes.func,
  defaultCurrency: PropTypes.string,
  buttonLabel: PropTypes.string,
  emptyCartMessage: PropTypes.string,
}

export default CartContent