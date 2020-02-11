import React from 'react'
import PropTypes from 'prop-types'

import { Fab, Tooltip } from '@material-ui/core'

const CartButton = ({ tooltip, ...otherProps }) => (
  <Tooltip title={tooltip}>
    <Fab
      style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
      }}
      color={'primary'}
      aria-label={'cart'}
      {...otherProps}
    >
      +
    </Fab>
  </Tooltip>
)

CartButton.propTypes = {
  tooltip: PropTypes.node,
}

export default CartButton