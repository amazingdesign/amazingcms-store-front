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
      label: `${marketingRequired ? '* ' : '\ \ '}${t('I consent to the processing of my personal data by the Amazing Company Sp. z o.o. (Nowa 8, 21-007, Mełgiew, VAT ID: PL7123301205, REGON: 362666508) for marketing purposes described in the Regulations and Privacy Policy available below, in particular by sending messages via e-mail to the provided e-mail address.')}`,
    },
  },
})
const consentsRequired = (t) => ['consentData']
const consentsRequiredProps = (t) => ({
  consentData: {
    type: 'boolean',
    errorMessage: t('Your consent is required!'),
    uniforms: {
      label: `* ${t('I consent that owner of the CodeRoad brand (Amazing Company Sp. z o.o., Nowa 8, 21-007, Mełgiew, NIP: 7123301203), is the administrator of my data, and I consent to all conditions specified in the Regulations and Privacy Policy, that are listed below, and accepts all of them.')}`,
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
        label: t('Address (accounting purposes only)'),
      },
      properties: {
        ...addressProps(t),
        ...consentsRequiredProps(t),
        ...consentsMarketingProps(t, { marketingRequired: false }),
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
        ...consentsRequiredProps(t),
        ...consentsMarketingProps(t, { marketingRequired: true }),
      },
    },
  },
})
