/* eslint-disable max-lines */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { getInstances } from 'redux-simple-cart'
import { useDispatch } from 'react-redux'

import { getConfigSSR } from '@bit/amazingdesign.utils.config'
import { flashSuccessMessage } from '@bit/amazingdesign.react-redux-mui-starter.flash-success-message'
import { getService } from '@bit/amazingdesign.redux-rest-services.get-service'
import { useServiceLoaded } from '@bit/amazingdesign.redux-rest-services.use-service-loaded'
import { makeSrc } from '@bit/amazingdesign.amazingcms.make-downloader-src'
import Page from '@bit/amazingdesign.react-redux-mui-starter.page'

import ProductGrid from '../src/bits/store-front/ProductGrid'

const PRODUCT_FIELDS = ['_id', 'price', 'currency', 'name', 'photo', 'published', 'description']
const PRODUCT_PLACEHOLDER = getConfigSSR('REACT_APP_PRODUCT_PLACEHOLDER')
const DEFAULT_CURRENCY = getConfigSSR('REACT_APP_DEFAULT_CURRENCY')

const UseServiceLoadedPage = ({ collectionName, coupon }) => {
  const { t } = useTranslation(undefined, { useSuspense: false })
  const dispatch = useDispatch()
  const router = useRouter()

  const [{ actions: cart }] = getInstances()

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

  const goToProductDescription = (productId) => (
    router.push(
      { pathname: '/description/[collectionName]/[productId]', query: coupon ? { coupon } : {} },
      `/description/${collectionName}/${productId}${coupon ? `?coupon=${coupon}` : ''}`
    )
  )

  useEffect(() => {
    router.prefetch('/summary/[orderId]')
    router.prefetch('/description/[collectionName]/[productId]')
  }, [])

  return (
    <Page
      style={{ maxWidth: 1024, margin: '0 auto' }}
    >
      <ErrorMessage
        message={t('Products load failed!')}
      >
        <ProductsLoader>
          <ProductGrid
            products={products && products.map && products.map((product) => ({
              ...product,
              currency: t(product.currency || DEFAULT_CURRENCY),
              price: String(product.price),
              photo: makeSrc('files')(product.photo),
              collectionName,
            }))}
            onCardClick={goToProductDescription}
            addToCartClick={(e, product) => addToCart(product)}
            addToCartLabel={t('Add to cart')}
            placeholder={PRODUCT_PLACEHOLDER}
          />
        </ProductsLoader>
      </ErrorMessage>
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