/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'

import {
  Button,
  Typography,
  Link,
} from '@material-ui/core'

import { makeSrc } from '@bit/amazingdesign.amazingcms.make-downloader-src'
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

const DEFAULT_CURRENCY = getConfigSSR('REACT_APP_DEFAULT_CURRENCY')
const REGS = JSON.parse(getConfigSSR('REACT_APP_REGS') || '[]')

const renderCurrency = (value) => String(value.toFixed(2))

const SummaryPage = ({ orderId, couponFromQs, buyerEmailFromQs }) => {
  const { t } = useTranslation(undefined, { useSuspense: false })

  const { Loader, ErrorMessage, data: orderData, get: getOrder, update: updateOrder } = useServiceLoaded(
    'orders',
    {
      globalParams: { populate: ['basket'], id: orderId },
      doNotLoadOnMount: true,
    }
  )
  const { basket, coupon, orderTotal, discountAmount } = (orderData || {})

  const [showCouponInput, setShowCouponInput] = useState((coupon || couponFromQs) ? true : false)

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
    if (couponFromQs && coupon !== couponFromQs) {
      applyCoupon(couponFromQs)
    }
  }, [])

  return (
    <Page
      style={{ maxWidth: 1024, margin: '0 auto' }}
      usePaper={true}
      paperProps={{ style: { position: 'relative' } }}
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
            items={basket && basket.map && basket.map((product) => ({
              ...product,
              photo: makeSrc('files')(product.photo),
            }))}
            defaultCurrency={t(DEFAULT_CURRENCY)}
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
                  {t('Discount')} {renderCurrency(discountAmount)} {t(DEFAULT_CURRENCY)}
                </>
                :
                null
            }
          />
          {
            showCouponInput ?
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
            model={{ buyerEmail: buyerEmailFromQs }}
            schema={schema(t)}
            onSubmit={makePayment}
            submitButton={(props) => (
              <>
                {
                  REGS && REGS.map((reg, index) => (
                    <span key={index}>
                      <Link
                        href={reg.link}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        variant={'body1'}
                      >
                        {reg.label}
                      </Link>
                      {' '}
                    </span>
                  ))
                }
                <br />
                <br />
                <Button
                  variant={'contained'}
                  color={'primary'}
                  fullWidth={true}
                  type={'submit'}
                  {...props}
                >
                  {t('Pay')} {orderData.orderTotal} {t('PLN')}
                </Button>
              </>
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
  buyerEmailFromQs: PropTypes.string,
}

SummaryPage.getInitialProps = async ({ query, store }) => {
  const { orderId, coupon: couponFromQs, buyerEmail: buyerEmailFromQs } = query

  const { get } = getService(store, 'orders')

  try {
    await get({ id: orderId, populate: ['basket'] })
    return { orderId, couponFromQs, buyerEmailFromQs }
  } catch (error) {
    return { orderId, couponFromQs, buyerEmailFromQs, error }
  }
}


export default SummaryPage