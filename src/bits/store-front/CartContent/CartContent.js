import React, { useMemo } from 'react'
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

const CartContent = ({
  items,
  removeItem,
  addItem,
  buttonLabel = 'Pay ',
  buttonClick,
  defaultCurrency = '$',
  emptyCartMessage,
}) => {
  const cartTotal = useMemo(() => items.reduce(
    (r, { price, quantity }) => r + price * (quantity || 1),
    0
  ), [items])

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
                    {
                      removeItem &&
                      <IconButton onClick={() => removeItem(item)}>
                        <Remove />
                      </IconButton>
                    }
                    {
                      addItem &&
                      <IconButton onClick={() => addItem(item)}>
                        <Add />
                      </IconButton>
                    }
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
          onClick={() => buttonClick && buttonClick(items)}
        >
          {buttonLabel} {cartTotal} {defaultCurrency}
        </Button>
      </>
  )
}

CartContent.propTypes = {
  items: PropTypes.array,
  removeItem: PropTypes.func,
  buttonClick: PropTypes.func,
  addItem: PropTypes.func,
  defaultCurrency: PropTypes.string,
  buttonLabel: PropTypes.string,
  emptyCartMessage: PropTypes.string,
}

export default CartContent