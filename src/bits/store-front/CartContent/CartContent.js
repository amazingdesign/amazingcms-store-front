/* eslint-disable max-lines */
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
import { makeStyles } from '@material-ui/core/styles'

import IconMessage from '@bit/amazingdesign.react-redux-mui-starter.icon-message'

const renderCurrency = (value) => String(value.toFixed(2))

const styles = {
  listItem: { paddingLeft: 0, paddingRight: 0 },
  avatar: { borderRadius: 0 },
  secondaryAction: { right: 0 },
}
const useStyles = makeStyles((theme) => ({
  '@media(max-width: 400px)': {
    hideAvatarOnSmallMobile: {
      display: 'none',
    },
  },
}))

const CartContent = ({
  items,
  removeItem,
  addItem,
  buttonLabel = 'Pay ',
  buttonClick,
  defaultCurrency = '$',
  emptyCartMessage,
  buttonComponent: ButtonComponent,
  summaryPrimaryText,
  summarySecondaryText,
  orderTotal,
  displaySummary,
  onOrderTotalClick,
}) => {
  const classes = useStyles()

  const cartTotalFromItems = useMemo(() => items.reduce(
    (r, { price, quantity }) => r + price * (quantity || 1),
    0
  ), [items])

  const displayedTotal = renderCurrency(orderTotal || orderTotal === 0 ? 0 : cartTotalFromItems)

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
              const itemTotal = renderCurrency((quantity || 1) * price)
              const displayedCurrency = currency || defaultCurrency
              return (
                <ListItem
                  key={id}
                  style={styles.listItem}
                >
                  <ListItemAvatar className={classes.hideAvatarOnSmallMobile}>
                    <Avatar
                      style={styles.avatar}
                      src={photo}
                      alt={`${name}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true }}
                    secondaryTypographyProps={{ noWrap: true }}
                    primary={`${name}`}
                    secondary={
                      `${price}${quantity > 1 ? ` x ${quantity} = ${itemTotal}` : ''} ${displayedCurrency}`
                    }
                  />
                  <ListItemSecondaryAction style={styles.secondaryAction}>
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
              .concat(
                displaySummary ?
                  <ListItem
                    key={`summary-${displayedTotal}-${summaryPrimaryText}-${summarySecondaryText}`}
                    style={styles.listItem}
                  >
                    <ListItemText
                      primaryTypographyProps={{ noWrap: true }}
                      secondaryTypographyProps={{ noWrap: true }}
                      primary={summaryPrimaryText}
                      secondary={summarySecondaryText}
                    />
                    <ListItemSecondaryAction style={styles.secondaryAction}>
                      <Chip
                        color={'primary'}
                        label={`${displayedTotal} ${defaultCurrency}`}
                        onClick={onOrderTotalClick}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  :
                  null
              )
          }
        </List>
        {
          ButtonComponent ?
            <ButtonComponent
              onClick={() => buttonClick && buttonClick(items)}
            />
            :
            <Button
              variant={'contained'}
              color={'primary'}
              fullWidth={true}
              onClick={() => buttonClick && buttonClick(items)}
            >
              {buttonLabel} {displayedTotal} {defaultCurrency}
            </Button>
        }
      </>
  )
}

CartContent.propTypes = {
  items: PropTypes.array,
  removeItem: PropTypes.func,
  buttonClick: PropTypes.func,
  buttonComponent: PropTypes.func,
  addItem: PropTypes.func,
  defaultCurrency: PropTypes.string,
  buttonLabel: PropTypes.string,
  emptyCartMessage: PropTypes.string,
  summaryPrimaryText: PropTypes.string,
  summarySecondaryText: PropTypes.string,
  displaySummary: PropTypes.bool,
  orderTotal: PropTypes.number,
  onOrderTotalClick: PropTypes.func,
}

export default CartContent