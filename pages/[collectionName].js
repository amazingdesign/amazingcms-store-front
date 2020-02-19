/* eslint-disable max-lines */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { getInstances } from 'redux-simple-cart'
import { useDispatch, useSelector } from 'react-redux'

import { flashMessage } from 'redux-flash'

import { getConfigSSR } from '@bit/amazingdesign.utils.config'
import { flashSuccessMessage } from '@bit/amazingdesign.react-redux-mui-starter.flash-success-message'
import { getService } from '@bit/amazingdesign.redux-rest-services.get-service'
import { useServiceLoaded } from '@bit/amazingdesign.redux-rest-services.use-service-loaded'
import { useService } from '@bit/amazingdesign.redux-rest-services.use-service'
import { makeSrc } from '@bit/amazingdesign.amazingcms.make-downloader-src'
import Page from '@bit/amazingdesign.react-redux-mui-starter.page'

import ProductGrid from '../src/bits/store-front/ProductGrid'
import Cart from '../src/bits/store-front/Cart'

const PRODUCT_FIELDS = ['_id', 'price', 'currency', 'name', 'photo', 'published', 'description']
const PRODUCT_PLACEHOLDER = getConfigSSR('REACT_APP_PRODUCT_PLACEHOLDER')
const DEFAULT_CURRENCY = getConfigSSR('REACT_APP_DEFAULT_CURRENCY')

const UseServiceLoadedPage = ({ collectionName, coupon }) => {
  const { t } = useTranslation(undefined, { useSuspense: false })
  const router = useRouter()
  const dispatch = useDispatch()

  const items = useSelector((store) => store.cart.items)
  const [{ actions: cart }] = getInstances()

  const { Loader: OrderLoader, create: createOrder, getState: getOrderState } = useService('orders')
  const { Loader: ProductsLoader, ErrorMessage, data: products } = useServiceLoaded(
    'products',
    {
      globalParams: { collectionName, fields: PRODUCT_FIELDS },
      doNotLoadOnMount: true,
    }
  )

  const addToCart = (product) => {
    dispatch(cart.add(product._id, product))
    dispatch(flashSuccessMessage(t('Added to cart!')))
  }
  const removeFromCart = (product) => {
    dispatch(cart.remove(product._id))
    dispatch(flashMessage(t('Removed from cart!')))
  }

  const makeOrder = (items) => {
    const basket = items.map((item) => ({
      id: item.id,
      collectionName: item.collectionName,
      quantity: item.quantity,
    }))

    return createOrder({}, { data: { basket } })
      .then(() => {
        const newOrderId = getOrderState('create.rawData._id')
        router.push(
          { pathname: '/summary/[orderId]', query: coupon ? { coupon } : {} },
          `/summary/${newOrderId}${coupon ? `?coupon=${coupon}` : ''}`
        )
      })
  }

  useEffect(() => {
    router.prefetch('/summary/[orderId]')
  }, [])

  return (
    <Page
      style={{ maxWidth: 1024, margin: '0 auto' }}
    >
      <OrderLoader>
        <div style={{ position: 'relative' }}>
          <ErrorMessage
            message={t('Products load failed!')}
          >
            <ProductsLoader>
              <ProductGrid
                products={products && products.map((product) => ({
                  ...product,
                  currency: t(product.currency || DEFAULT_CURRENCY),
                  price: String(product.price),
                  photo: makeSrc('files')(product.photo),
                  collectionName,
                }))}
                addToCartClick={(e, product) => addToCart(product)}
                addToCartLabel={t('Add to cart')}
                placeholder={PRODUCT_PLACEHOLDER}
              />
            </ProductsLoader>
          </ErrorMessage>
        </div>
        <Cart
          tooltip={t('Open cart')}
          closeLabel={t('Close')}
          buttonLabel={t('Go to summary')}
          defaultCurrency={t(DEFAULT_CURRENCY)}
          emptyCartMessage={t('Empty cart! Add some items!')}
          items={items}
          addItem={(product) => addToCart({ ...product, quantity: 1 })}
          removeItem={(product) => removeFromCart(product)}
          buttonClick={makeOrder}
        />
      </OrderLoader>
    </Page>
  )
}

UseServiceLoadedPage.propTypes = {
  collectionName: PropTypes.string,
  coupon: PropTypes.string,
}

UseServiceLoadedPage.getInitialProps = async ({ query, store }) => {
  const { collectionName, coupon } = query

  const { find } = getService(store, 'products', { collectionName })

  try {
    const result = await find({ fields: PRODUCT_FIELDS })
    return { collectionName, coupon, result }
  } catch (error) {
    return { collectionName, coupon, error }
  }
}

export default UseServiceLoadedPage