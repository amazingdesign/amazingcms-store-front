import React from 'react'
import PropTypes from 'prop-types'

import { JSONSchemaBridge } from 'uniforms-bridge-json-schema'
import { AutoForm } from 'uniforms-material'
import { createValidator } from './validator'

import { styled } from '@material-ui/core/styles'

const StyledAutoForm = styled(AutoForm)({
  '& .MuiTypography-body1': {
    fontSize: '0.8rem',
    marginLeft: 12,
    textIndent: -8,
    whiteSpace: 'pre-wrap',
  },
})

const OrderForm = ({ schema, model, onSubmit, onChange, submitButton, ...otherProps }) => {
  const schemaValidator = createValidator(schema)
  const bridge = new JSONSchemaBridge(schema, schemaValidator)

  return (
    <StyledAutoForm
      onSubmit={onSubmit}
      onChange={onChange}
      schema={bridge}
      model={model}
      showInlineError={true}
      errorsField={() => null}
      submitField={submitButton}
      {...otherProps}
    />
  )
}

OrderForm.propTypes = {
  submitButton: PropTypes.func,
  schema: PropTypes.object,
  model: PropTypes.object,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
}

export default OrderForm