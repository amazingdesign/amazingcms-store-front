/* eslint-disable max-lines */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import dynamic from 'next/dynamic'

import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { getInstances } from 'redux-simple-cart'
import { useDispatch } from 'react-redux'

import { getConfigSSR } from '@bit/amazingdesign.utils.config'
import { getService } from '@bit/amazingdesign.redux-rest-services.get-service'
import { useServiceLoaded } from '@bit/amazingdesign.redux-rest-services.use-service-loaded'
import { makeSrc } from '@bit/amazingdesign.amazingcms.make-downloader-src'
import { flashSuccessMessage } from '@bit/amazingdesign.react-redux-mui-starter.flash-success-message'

import Page from '@bit/amazingdesign.react-redux-mui-starter.page'

import ProductCard from '../../../src/bits/store-front/ProductCard'
import MUIMarkdown from '@bit/amazingdesign.react-redux-mui-starter.mui-markdown'

const ReadOnlyEditor = dynamic(
  () => import('@bit/amazingdesign.react-redux-mui-starter.read-only-drat-editor'),
  { ssr: false }
)

const PRODUCT_FIELDS = (
  JSON.parse(getConfigSSR('REACT_APP_PRODUCT_FIELDS') || 'null') ||
  ['_id', 'price', 'currency', 'name', 'photo', 'published', 'content']
)
const ProductPage = ({ collectionName, productId, coupon }) => {
  const { t } = useTranslation(undefined, { useSuspense: false })
  const [{ actions: cart }] = getInstances()
  const dispatch = useDispatch()
  const router = useRouter()

  const { Loader, ErrorMessage, data: product } = useServiceLoaded(
    'products',
    {
      globalParams: { collectionName, id: productId, fields: PRODUCT_FIELDS },
      doNotLoadOnMount: true,
    }
  )

  const addToCart = (product) => {
    dispatch(cart.add(product._id, { ...product, collectionName }))
    dispatch(flashSuccessMessage(t('Added to cart!')))
  }

  const goBack = () => (
    router.push(
      { pathname: '/[collectionName]', query: coupon ? { coupon } : {} },
      `/${collectionName}${coupon ? `?coupon=${coupon}` : ''}`
    )
  )

  useEffect(() => {
    router.prefetch('/[collectionName]')
  }, [])

  return (
    <Page
      style={{ maxWidth: 1024, margin: '0 auto' }}
    >
      <ErrorMessage
        message={t('Product load failed!')}
      >
        <Loader>
          {
            product &&
            <ProductCard
              id={product._id}
              image={makeSrc('files')(product.photo)}
              name={product.name}
              price={product.price}
              currency={product.currency}
              displayDescription={false}

              fullScreen={true}
              actions={[
                {
                  label: t('Go back'),
                  icon: 'keyboard_backspace',
                  onClick: goBack,
                },
                {
                  addPriceTag: true,
                  label: t('Add to cart'),
                  icon: 'add_shopping_cart',
                  onClick: () => addToCart(product),
                },
              ]}
            >
              {
                product.content ?
                  typeof product.content !== 'string' ?
                    <ReadOnlyEditor content={product.content} />
                    :
                    <MUIMarkdown>
                      {product.content}
                    </MUIMarkdown>
                  :
                  null
              }
            </ProductCard>
          }
        </Loader>
      </ErrorMessage>
    </Page>
  )
}

ProductPage.propTypes = {
  collectionName: PropTypes.string,
  productId: PropTypes.string,
  coupon: PropTypes.string,
}

ProductPage.getInitialProps = async ({ query, store }) => {
  const { collectionName, productId, coupon } = query

  const { get } = getService(store, 'products', { collectionName })

  try {
    const result = await get({ id: productId, fields: PRODUCT_FIELDS })
    return { collectionName, coupon, productId, result }
  } catch (error) {
    return { collectionName, coupon, productId, error }
  }
}

export default ProductPage