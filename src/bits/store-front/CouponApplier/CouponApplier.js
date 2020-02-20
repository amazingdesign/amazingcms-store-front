import React, { useState } from 'react'
import PropTypes from 'prop-types'
import InputWithButton from '@bit/amazingdesign.react-redux-mui-starter.input-with-button'

import { useTheme } from '@material-ui/core/styles'

const CouponApplier = ({ placeholder, onClick, defaultValue, tooltip, success }) => {
  const theme = useTheme()
  const successColor = theme.palette.success.main

  const [coupon, setCoupon] = useState(defaultValue || '')

  return (
    <div>
      <InputWithButton
        placeholder={placeholder}
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        onClick={() => onClick && onClick(coupon)}
        tooltip={tooltip}
        iconProps={success && coupon === defaultValue ? { style: { color: successColor } } : {}}
      />
    </div>
  )
}

CouponApplier.propTypes = {
  tooltip: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onClick: PropTypes.func,
  success: PropTypes.bool,
}

export default CouponApplier