/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { useTranslation } from 'react-i18next'

import {
  Button,
  Typography,
} from '@material-ui/core'

import { getConfigSSR } from '@bit/amazingdesign.utils.config'
import { getService } from '@bit/amazingdesign.redux-rest-services.get-service'
import { useServiceLoaded } from '@bit/amazingdesign.redux-rest-services.use-service-loaded'
import Page from '@bit/amazingdesign.react-redux-mui-starter.page'

import CouponApplier from '../../src/bits/store-front/CouponApplier'
import CartContent from '../../src/bits/store-front/CartContent'
import OrderForm from '../../src/bits/store-front/OrderForm'
import axios from '../../src/axios'

import {
  buySchema as schema,
} from '../../src/buySchema'

const LanguageSwitcher = dynamic(
  () => import('@bit/amazingdesign.react-redux-mui-starter.language-switcher'),
  { ssr: false }
)
const languages = JSON.parse(getConfigSSR('REACT_APP_LANGUAGES') || '[]')
const renderCurrency = (value) => String(value.toFixed(2))

const SummaryPage = ({ orderId, couponFromQs }) => {
  const [showCouponInput, setShowCouponInput] = useState(false)

  const { t } = useTranslation(undefined, { useSuspense: false })

  const { Loader, ErrorMessage, data: orderData, get: getOrder, update: updateOrder } = useServiceLoaded(
    'orders',
    {
      globalParams: { populate: ['basket'], id: orderId },
      doNotLoadOnMount: true,
    }
  )
  const { basket, coupon, orderTotal, discountAmount } = (orderData || {})

  const makePayment = async ({ buyerEmail, additionalInfo }) => {
    updateOrder({}, { data: { buyerEmail, additionalInfo } })
      .then(() => axios.get(
        // eslint-disable-next-line max-len
        `${window._env_.REACT_APP_API_URL}/payments/${orderId}?customer[name]=${additionalInfo.name}&&customer[email]=${buyerEmail}`
      ))
      .then((response) => response.data)
      .then((payment) => {
        const { redirectURL } = payment

        window.open(redirectURL)
      })
  }

  const applyCoupon = (coupon) => {
    updateOrder({}, { data: { coupon } }).then(() => getOrder())
  }

  useEffect(() => {
    if(couponFromQs && coupon !== couponFromQs){
      applyCoupon(couponFromQs)
    }
  }, [])

  return (
    <Page
      style={{ maxWidth: 1024, margin: '0 auto' }}
      usePaper={true}
      paperProps={{ style: { position: 'relative' } }}
      childrenAbove={(
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '1rem' }}>
          <LanguageSwitcher
            noLabel={true}
            languages={languages.map((language) => ({ ...language, name: t(language.name) }))}
          />
        </div>
      )}
    >
      <ErrorMessage
        actionName={'get'}
        message={t('Order load failed!')}
      >
        <Loader>
          <Typography variant={'h6'}>
            {t('Order summary')}
          </Typography>
          <Typography variant={'caption'}>
            {t('ID')} - {orderId}
          </Typography>
          <CartContent
            items={basket}
            defaultCurrency={t('PLN')}
            emptyCartMessage={t('Empty cart! Add some items!')}
            buttonComponent={() => null}

            onOrderTotalClick={showCouponInput ? null : () => setShowCouponInput(true)}
            displaySummary={true}
            orderTotal={orderTotal}
            summaryPrimaryText={t('ORDER TOTAL')}
            summarySecondaryText={
              coupon ?
                <>
                  {t('Coupon')} {coupon}
                  <br />
                  {t('Discount')} {renderCurrency(discountAmount)} {t('PLN')}
                </>
                :
                null
            }
          />
          {
            showCouponInput || coupon || couponFromQs ?
              <>
                <CouponApplier
                  placeholder={t('Coupon')}
                  defaultValue={coupon || couponFromQs}
                  onClick={applyCoupon}
                  tooltip={coupon ? t('Reapply coupon!') : t('Apply coupon!')}
                  success={coupon ? true : false}
                />
                <br />
              </>
              :
              null
          }
          <Typography variant={'h6'}>
            {t('Billing address')}
          </Typography>
          <OrderForm
            schema={schema(t)}
            onSubmit={makePayment}
            submitButton={(props) => (
              <Button
                variant={'contained'}
                color={'primary'}
                fullWidth={true}
                type={'submit'}
                {...props}
              >
                {t('Pay')} {orderData.orderTotal} {t('PLN')}
              </Button>
            )}
          />
        </Loader>
      </ErrorMessage>
    </Page>
  )
}

SummaryPage.propTypes = {
  orderId: PropTypes.string.isRequired,
  couponFromQs: PropTypes.string,
}

SummaryPage.getInitialProps = async ({ query, store }) => {
  const { orderId, coupon: couponFromQs } = query

  const { get } = getService(store, 'orders')

  try {
    await get({ id: orderId, populate: ['basket'] })
    return { orderId, couponFromQs }
  } catch (error) {
    return { orderId, couponFromQs, error }
  }
}


export default SummaryPage