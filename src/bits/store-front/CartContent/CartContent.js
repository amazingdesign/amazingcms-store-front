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

import OrderForm from '../OrderForm'
import IconMessage from '@bit/amazingdesign.react-redux-mui-starter.icon-message'

const renderCurrency = (value) => String(value.toFixed(2))

const useStyles = makeStyles((theme) => ({
  avatar: { borderRadius: 0 },
  secondaryAction: {
    backgroundColor: theme.palette.background.default,
    right: 0,
    [theme.breakpoints.down('xs')]: {
      position: 'static',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transform: 'none',
    },
  },
  summarySecondaryAction: {
    backgroundColor: theme.palette.background.default,
    right: 0,
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
    overflow: 'hidden',
  },
  summaryListItem: {
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
  },
  hideAvatarOnSmallMobile: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  showAvatarOnSmallMobile: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'initial',
    },
  },
  button: {
    marginTop: '1.5rem',
  },
}))

const CartContent = ({
  schema,
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

  const displayedTotal = renderCurrency(orderTotal || (orderTotal === 0 ? 0 : cartTotalFromItems))

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
                  className={classes.listItem}
                >
                  <ListItemAvatar className={classes.hideAvatarOnSmallMobile}>
                    <Avatar
                      className={classes.avatar}
                      src={photo}
                      alt={`${name}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true, component: 'p' }}
                    secondaryTypographyProps={{ noWrap: true, component: 'p' }}
                    primary={`${name}`}
                    secondary={
                      `${price}${quantity > 1 ? ` x ${quantity} = ${itemTotal}` : ''} ${displayedCurrency}`
                    }
                  />
                  <ListItemSecondaryAction className={classes.secondaryAction}>
                    <ListItemAvatar className={classes.showAvatarOnSmallMobile}>
                      <Avatar
                        className={classes.avatar}
                        src={photo}
                        alt={`${name}`}
                      />
                    </ListItemAvatar>
                    <div>
                      {
                        addItem &&
                        <IconButton onClick={() => addItem(item)}>
                          <Add />
                        </IconButton>
                      }
                      {
                        removeItem &&
                        <IconButton onClick={() => removeItem(item)}>
                          <Remove />
                        </IconButton>
                      }
                      <Chip
                        label={`${itemTotal} ${displayedCurrency}`}
                        variant={'outlined'}
                      />
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })
              .concat(
                displaySummary ?
                  <ListItem
                    key={`summary-${displayedTotal}-${summaryPrimaryText}-${summarySecondaryText}`}
                    className={classes.listItem + ' ' + classes.summaryListItem}
                  >
                    <ListItemText
                      primaryTypographyProps={{ noWrap: true }}
                      secondaryTypographyProps={{ noWrap: true }}
                      primary={summaryPrimaryText}
                      secondary={summarySecondaryText}
                    />
                    <ListItemSecondaryAction className={classes.summarySecondaryAction}>
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
        <OrderForm
          schema={schema || {}}
          onSubmit={(formData) => buttonClick && buttonClick(items, formData)}
          submitButton={() => (
            ButtonComponent ?
              <ButtonComponent type={'submit'} />
              :
              <Button
                type={'submit'}
                className={classes.button}
                variant={'contained'}
                color={'primary'}
                fullWidth={true}
              >
                {buttonLabel} {displayedTotal} {defaultCurrency}
              </Button>

          )}
        />
      </>
  )
}

CartContent.propTypes = {
  schema: PropTypes.object,
  items: PropTypes.array,
  removeItem: PropTypes.func,
  buttonClick: PropTypes.func,
  buttonComponent: PropTypes.func,
  addItem: PropTypes.func,
  defaultCurrency: PropTypes.string,
  buttonLabel: PropTypes.string,
  emptyCartMessage: PropTypes.string,
  summaryPrimaryText: PropTypes.node,
  summarySecondaryText: PropTypes.node,
  displaySummary: PropTypes.bool,
  orderTotal: PropTypes.number,
  onOrderTotalClick: PropTypes.func,
}

export default CartContent