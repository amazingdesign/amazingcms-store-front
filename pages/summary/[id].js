import React from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import axios from '../../src/axios'

import { getService } from '@bit/amazingdesign.redux-rest-services.get-service'

import CartContent from '../../src/bits/store-front/CartContent'

const SummaryPage = ({ order }) => {
  const { t } = useTranslation(undefined, { useSuspense: false })
  const { basket, _id: orderId } = order

  const makePayment = async (name, email) => {
    const payment = await axios.get(
      `${window._env_.REACT_APP_API_URL}/payments/${orderId}?customer[name]=${name}&&customer[email]=${email}`
    ).then((response) => response.data)

    const { redirectURL } = payment

    window.open(redirectURL)
  }

  return (
    <CartContent
      items={basket}
      buttonLabel={t('Pay')}
      defaultCurrency={t('$')}
      emptyCartMessage={t('Empty cart! Add some items!')}
      buttonClick={() => makePayment()}
    />
  )
}

SummaryPage.propTypes = {
  order: PropTypes.object.isRequired,
}

SummaryPage.getInitialProps = async ({ query, store }) => {
  const { id } = query

  const { get, getState } = getService(store, 'orders')

  // try {
  await get({ id, populate: ['basket'] })

  const order = getState('get.rawData')

  return { id, order }
  // } catch (error) {
  //   return { id }
  // }
}


export default SummaryPage