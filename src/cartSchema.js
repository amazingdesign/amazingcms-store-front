const cartSchema = (t) => ({
  type: 'object',
  required: ['buyerEmail'],
  properties: {
    buyerEmail: {
      type: 'string',
      format: 'email',
      errorMessage: t('You must enter a valid email address!'),
      uniforms: {
        label: t('E-mail'),
        margin: 'dense',
      },
    },
  },
})

export default cartSchema