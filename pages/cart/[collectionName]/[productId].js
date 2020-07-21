/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { flashErrorMessage } from 'redux-flash'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import {
  Button,
  Typography,
  Link,
} from '@material-ui/core'

import { makeSrc } from '@bit/amazingdesign.amazingcms.make-downloader-src'
import { getConfigSSR } from '@bit/amazingdesign.utils.config'
import { getService } from '@bit/amazingdesign.redux-rest-services.get-service'
import { useService } from '@bit/amazingdesign.redux-rest-services.use-service'
import { useServiceLoaded } from '@bit/amazingdesign.redux-rest-services.use-service-loaded'
import Page from '@bit/amazingdesign.react-redux-mui-starter.page'

import CouponApplier from '../../../src/bits/store-front/CouponApplier'
import CartContent from '../../../src/bits/store-front/CartContent'
import OrderForm from '../../../src/bits/store-front/OrderForm'
import axios from '../../../src/axios'

import {
  buySchema as schema,
} from '../../../src/buySchema'

const DEFAULT_CURRENCY = getConfigSSR('REACT_APP_DEFAULT_CURRENCY')
const REGS = JSON.parse(getConfigSSR('REACT_APP_REGS') || '[]')
const PRODUCT_FIELDS = (
  JSON.parse(getConfigSSR('REACT_APP_PRODUCT_FIELDS') || 'null') ||
  ['_id', 'price', 'currency', 'name', 'photo', 'published', 'content']
)

const CartPage = ({ productId, collectionName, couponFromQs, buyerEmailFromQs }) => {
  const { t } = useTranslation(undefined, { useSuspense: false })
  const router = useRouter()
  const dispatch = useDispatch()

  // eslint-disable-next-line max-len
  const { Loader: OrderLoader, ErrorMessage: OrderErrorMessage, create: createOrder } = useService(
    'orders',
  )
  const { Loader, ErrorMessage, data: product } = useServiceLoaded(
    'products',
    {
      globalParams: { collectionName, id: productId, fields: PRODUCT_FIELDS },
      doNotLoadOnMount: true,
    }
  )
  const basket = [{
    id: productId,
    collectionName: collectionName,
    quantity: 1,
  }]
  const basketPopulated = [product]

  const [showCouponInput, setShowCouponInput] = useState((couponFromQs) ? true : false)
  const [model, setModel] = useState({ buyerEmail: buyerEmailFromQs })

  const makePayment = async ({ buyerEmail, additionalInfo }) => {
    createOrder({}, { data: { buyerEmail, basket, additionalInfo } })
      .then(({ _id: orderId }) => axios.get(
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
    const { buyerEmail, additionalInfo } = model

    if (!model.buyerEmail) {
      dispatch(flashErrorMessage(
        t('Can\'t apply coupon without e-mail address provided. Type e-mail below and try again!')
      ))
      return
    }

    createOrder({}, { data: { buyerEmail, basket, additionalInfo } })
      .then(({ _id: orderId }) => {
        router.push(
          // eslint-disable-next-line max-len
          `/summary/[orderId]?buyerEmail=${buyerEmail}&coupon=${coupon}&additionalInfo=${JSON.stringify(additionalInfo)}`,
          // eslint-disable-next-line max-len
          `/summary/${orderId}?buyerEmail=${buyerEmail}&coupon=${coupon}&additionalInfo=${JSON.stringify(additionalInfo)}`
        )
      })
  }

  useEffect(() => {
    if (couponFromQs) applyCoupon(couponFromQs)
  }, [])

  return (
    <Page
      style={{ maxWidth: 1024, margin: '0 auto' }}
      usePaper={true}
      paperProps={{ style: { position: 'relative' } }}
    >
      <ErrorMessage
        actionName={'get'}
        message={t('Product load failed!')}
      >
        <OrderErrorMessage
          actionName={'get'}
          message={t('Order load failed!')}
        >
          <Loader>
            <OrderLoader>
              <Typography variant={'h6'}>
                {t('Chosen products')}
              </Typography>
              <CartContent
                items={basketPopulated && basketPopulated.map && basketPopulated.map((product) => ({
                  ...product,
                  photo: product && makeSrc('files')(product.photo),
                }))}
                defaultCurrency={t(DEFAULT_CURRENCY)}
                emptyCartMessage={t('Empty cart! Add some items!')}
                buttonComponent={() => null}

                onOrderTotalClick={showCouponInput ? null : () => setShowCouponInput(true)}
                displaySummary={true}
                summaryPrimaryText={t('ORDER TOTAL')}
                summarySecondaryText={null}
              />
              {
                showCouponInput ?
                  <>
                    <CouponApplier
                      placeholder={t('Coupon')}
                      defaultValue={couponFromQs}
                      onClick={applyCoupon}
                      tooltip={t('Apply coupon!')}
                      success={false}
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
                model={model}
                onChangeModel={setModel}
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
                      {t('Pay')} {product.price} {t('PLN')}
                    </Button>
                  </>
                )}
              />
            </OrderLoader>
          </Loader>
        </OrderErrorMessage>
      </ErrorMessage>
    </Page>
  )
}

CartPage.propTypes = {
  productId: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  couponFromQs: PropTypes.string,
  buyerEmailFromQs: PropTypes.string,
}

CartPage.getInitialProps = async ({ query, store }) => {
  const { productId, collectionName, coupon: couponFromQs, buyerEmail: buyerEmailFromQs } = query

  const { get } = getService(store, 'products')

  try {
    await get({ id: productId, collectionName })
    return { productId, collectionName, couponFromQs, buyerEmailFromQs }
  } catch (error) {
    return { productId, collectionName, couponFromQs, buyerEmailFromQs, error }
  }
}


export default CartPage