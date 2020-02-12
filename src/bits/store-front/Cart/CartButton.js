import React from 'react'
import PropTypes from 'prop-types'

import { Fab, Tooltip, Badge } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ShoppingCart from '@material-ui/icons/ShoppingCart'

const StyledBadge = withStyles(theme => ({
  badge: {
    right: -10,
    top: -6,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge)

const CartButton = ({ tooltip, itemsCount, ...otherProps }) => (
  <Tooltip title={tooltip}>
    <Fab
      style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
      }}
      size={'large'}
      color={'primary'}
      aria-label={'cart'}
      {...otherProps}
    >
      <StyledBadge
        invisible={!itemsCount}
        badgeContent={itemsCount}
        color={'secondary'}
      >
        <ShoppingCart />
      </StyledBadge>
    </Fab>
  </Tooltip>
)

CartButton.propTypes = {
  tooltip: PropTypes.node,
  itemsCount: PropTypes.number,
}

export default CartButton