/* eslint-disable max-lines */
import React, { Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useTranslation } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'
import { getInstances } from 'redux-simple-cart'
import { flashMessage } from 'redux-flash'

import { makeStyles } from '@material-ui/core/styles'

import { flashSuccessMessage } from '@bit/amazingdesign.react-redux-mui-starter.flash-success-message'
import { getConfigSSR } from '@bit/amazingdesign.utils.config'
import { useService } from '@bit/amazingdesign.redux-rest-services.use-service'
import RouteLoader from '@bit/amazingdesign.react-redux-mui-starter.loading-indictor'

import Cart from '../bits/store-front/Cart'

const useStyles = makeStyles({
  navbar: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    maxWidth: 200,
    maxHeight: 37,
    objectFit: 'contain',
    '@media (max-width: 400px)': {
      maxWidth: 170,
    },
  },
})

const languages = JSON.parse(getConfigSSR('REACT_APP_LANGUAGES') || '[]')
const LanguageSwitcher = dynamic(
  () => import('@bit/amazingdesign.react-redux-mui-starter.language-switcher'),
  { ssr: false }
)

const PRODUCTS_COLLECTION = getConfigSSR('REACT_APP_DEFAULT_PRODUCTS_COLLECTION')
const DEFAULT_CURRENCY = getConfigSSR('REACT_APP_DEFAULT_CURRENCY')

const Layout = ({ children, coupon }) => {
  const { t } = useTranslation(undefined, { useSuspense: false })
  const dispatch = useDispatch()
  const router = useRouter()
  const classes = useStyles()

  const [isRouteLoading, setRouteLoading] = useState(false)

  const items = useSelector((store) => store.cart.items)
  const [{ actions: cart }] = getInstances()

  const { Loader: OrderLoader, create: createOrder, getState: getOrderState } = useService('orders')

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
    router.events.on('routeChangeStart', url => {
      setRouteLoading(true)
    })
    router.events.on('routeChangeComplete', () => {
      setRouteLoading(false)
    })
    router.events.on('routeChangeError', () => {
      setRouteLoading(false)
    })
  }, [])

  return (
    <>
      <div className={classes.navbar}>
        <Link
          href={{ pathname: '/[collectionName]', query: coupon ? { coupon } : {} }}
          as={`/${PRODUCTS_COLLECTION}${coupon ? `?coupon=${coupon}` : ''}`}
        >
          <a className={classes.logoWrapper}>
            <img
              src={'https://backend.staging.coderoad.pl/api/downloader/files/5e4d6dbeb30a840011c744d5'}
              alt={'Store Logo'}
              className={classes.logo}
            />
          </a>
        </Link>
        {
          typeof window !== 'undefined' ?
            <Suspense fallback={null}>
              <LanguageSwitcher
                noLabel={true}
                languages={languages.map((language) => ({ ...language, name: t(language.name) }))}
              />
            </Suspense>
            :
            null
        }
      </div>
      <div style={{ position: 'relative' }}>
        {
          isRouteLoading ?
            <RouteLoader />
            :
            null
        }
        <OrderLoader
          actionName={'create'}
        >
          {children}
        </OrderLoader>
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
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  coupon: PropTypes.string,
}

export default Layout