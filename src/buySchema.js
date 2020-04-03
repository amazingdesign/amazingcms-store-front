/* eslint-disable */
const addressRequired = (t) => ['name', 'street', 'zip', 'city']
const addressProps = (t) => ({
  name: {
    type: 'string',
    errorMessage: t('You must enter your full name!'),
    uniforms: {
      label: t('Full name'),
      margin: 'dense',
    },
  },
  street: {
    type: 'string',
    errorMessage: t('You must enter your street and building/apartment number'),
    uniforms: {
      label: t('Street and building/apartment number'),
      margin: 'dense',
    },
  },
  zip: {
    type: 'string',
    errorMessage: t('You must enter ZIP code'),
    uniforms: {
      label: t('ZIP code'),
      margin: 'dense',
    },
  },
  city: {
    type: 'string',
    errorMessage: t('You must enter your city'),
    uniforms: {
      label: t('City'),
      margin: 'dense',
    },
  },
  nip: {
    type: 'string',
    errorMessage: t('You must enter valid VAT ID'),
    uniforms: {
      label: t('VAT ID (not required)'),
      margin: 'dense',
    },
  },
})

const consentsMarketing = (t) => ['consentMarketing']
const consentsMarketingProps = (t, { marketingRequired }) => ({
  consentMarketing: {
    type: 'boolean',
    errorMessage: t('Your consent is required!'),
    uniforms: {
      label: `${marketingRequired ? '* ' : '- '}${t('I consent to the processing of my personal data by the Amazing Company Sp. z o.o. (Nowa 8, 21-007, Mełgiew, VAT ID: PL7123301205, REGON: 362666508) for marketing purposes described in the Regulations and Privacy Policy available below, in particular by sending messages via e-mail to the provided e-mail address.')}`,
    },
  },
})
const consentsRequired = (t) => ['consentData']
const consentsRequiredProps = (t) => ({
  consentData: {
    type: 'boolean',
    errorMessage: t('Your consent is required!'),
    uniforms: {
      label: `* ${t('I consent to all conditions specified in the Regulations and Privacy Policy, that are listed below, and accepts all of them. Especially I consent to the processing of my personal data by the Amazing Company Sp. z o.o. (Nowa 8, 21-007, Mełgiew, VAT ID: PL7123301205, REGON: 362666508) described in the Regulations and Privacy Policy available below, in particular for the purposes of providing access to the online course via the platform located under the domain coderoad.pl, by sending messages via e-mail to the e-mail address provided, as well as address details for administrative, billing and accounting purposes.')}`,
    },
  },
})

const commonRequired = (t) => ['buyerEmail']

const commonProps = (t) => ({
  buyerEmail: {
    type: 'string',
    format: 'email',
    errorMessage: t('You must enter a valid email address!'),
    uniforms: {
      label: t('E-mail'),
      margin: 'dense',
    },
  },
})

export const buySchema = (t) => ({
  type: 'object',
  required: [...commonRequired(t)],
  errorMessage: '',
  properties: {
    ...commonProps(t),
    additionalInfo: {
      type: 'object',
      required: [...addressRequired(t), ...consentsRequired(t)],
      errorMessage: '',
      uniforms: {
        label: 'Adres',
      },
      properties: {
        ...addressProps(t),
        ...consentsMarketingProps(t, { marketingRequired: false }),
        ...consentsRequiredProps(t),
      },
    },
  },
})

export const trySchema = (t) => ({
  type: 'object',
  required: [...commonRequired(t)],
  errorMessage: '',
  properties: {
    ...commonProps(t),
    additionalInfo: {
      type: 'object',
      required: [...consentsMarketing(t), ...consentsRequired(t)],
      errorMessage: '',
      uniforms: {
        label: '',
      },
      properties: {
        ...consentsMarketingProps(t, { marketingRequired: true }),
        ...consentsRequiredProps(t),
      },
    },
  },
})
