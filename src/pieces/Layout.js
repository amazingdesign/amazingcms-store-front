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

import cartSchema from '../cartSchema'

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

  const makeOrder = (items, { buyerEmail }) => {
    const basket = items.map((item) => ({
      id: item.id,
      collectionName: item.collectionName,
      quantity: item.quantity,
    }))

    return createOrder({}, { data: { basket, buyerEmail } })
      .then(() => {
        const newOrderId = getOrderState('create.rawData._id')
        router.push(
          { pathname: '/summary/[orderId]', query: coupon ? { coupon, buyerEmail } : { buyerEmail } },
          `/summary/${newOrderId}?buyerEmail=${buyerEmail}${coupon ? `&coupon=${coupon}` : ''}`
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
              // eslint-disable-next-line max-len
              src={'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OTEuNzI5IiBoZWlnaHQ9IjYwIj48ZyBkYXRhLW5hbWU9IkxvZ28gLSBncmV5IiBmaWxsPSIjMzIzMzMwIj48cGF0aCBkYXRhLW5hbWU9IlBhdGggMiIgZD0iTTM5LjIzNCA0Ni42MWEuODE2LjgxNiAwIDAgMSAuNi4yNDdsMS40MSAxLjUxNmEyMy43NjkgMjMuNzY5IDAgMCAxLTMuMzY4IDIuOTc5IDIwLjU2MSAyMC41NjEgMCAwIDEtMy45ODMgMi4yNTYgMjMuNDg1IDIzLjQ4NSAwIDAgMS00Ljc1OSAxLjQ0NSAyOS40NjUgMjkuNDY1IDAgMCAxLTUuNjkzLjUxMSAyNC4yNzEgMjQuMjcxIDAgMCAxLTkuNS0xLjgxNUEyMS4yNzMgMjEuMjczIDAgMCAxIDYuNTIyIDQ4LjZhMjMuMjc1IDIzLjI3NSAwIDAgMS00LjgxMi04LjA1NUEzMC42ODUgMzAuNjg1IDAgMCAxIDAgMzAuMDQ1YTI5LjI0MyAyOS4yNDMgMCAwIDEgMS43NjMtMTAuMzY2IDIzLjggMjMuOCAwIDAgMSA0LjkzNS04LjA1NSAyMS44OTEgMjEuODkxIDAgMCAxIDcuNjE0LTUuMjE3IDI1LjIzNiAyNS4yMzYgMCAwIDEgOS44LTEuODUxIDI0LjE1NSAyNC4xNTUgMCAwIDEgOS4wNTkgMS41ODYgMjQuNDI4IDI0LjQyOCAwIDAgMSA3LjE5MSA0LjQ3N2wtMS4wOTMgMS41ODZhLjk4NC45ODQgMCAwIDEtLjg4MS40MjMgMi44NDQgMi44NDQgMCAwIDEtMS4zNzUtLjc3NiAxOC4yNDIgMTguMjQyIDAgMCAwLTIuNjQ0LTEuNzEgMjIuNDYgMjIuNDYgMCAwIDAtNC4yMTItMS43MSAyMC43MDggMjAuNzA4IDAgMCAwLTYuMDQ1LS43NzUgMjEuNDQ1IDIxLjQ0NSAwIDAgMC04LjI2NiAxLjU1MSAxOC4yMjEgMTguMjIxIDAgMCAwLTYuNDUxIDQuNDQxQTIwLjQ1IDIwLjQ1IDAgMCAwIDUuMTgyIDIwLjdhMjcuMTQgMjcuMTQgMCAwIDAtMS41MTYgOS4zNDNBMjcuMTg4IDI3LjE4OCAwIDAgMCA1LjIgMzkuNDlhMjAuNjI0IDIwLjYyNCAwIDAgMCA0LjIxMiA3LjAzMiAxOC4xODcgMTguMTg3IDAgMCAwIDYuMzI3IDQuNDA2IDIwLjEyNSAyMC4xMjUgMCAwIDAgNy44NzggMS41MzMgMjkuMDM1IDI5LjAzNSAwIDAgMCA0Ljc3Ni0uMzUyIDE4LjczIDE4LjczIDAgMCAwIDMuODYtMS4wNTggMTcuNCAxNy40IDAgMCAwIDMuMjc4LTEuNzI3IDI0Ljc4NCAyNC43ODQgMCAwIDAgMy0yLjQgMiAyIDAgMCAxIC4zNTMtLjIyOS43ODIuNzgyIDAgMCAxIC4zNS0uMDg1em01NS4xMzEtMTYuNTY3YTMwLjI1MyAzMC4yNTMgMCAwIDEtMS43MjggMTAuNDg3IDIzLjIzMyAyMy4yMzMgMCAwIDEtNC44NjEgOC4wMzcgMjEuNDc1IDIxLjQ3NSAwIDAgMS03LjUyNiA1LjE0NiAyNS4wNzcgMjUuMDc3IDAgMCAxLTkuNjc5IDEuODE2IDI0Ljk0NSAyNC45NDUgMCAwIDEtOS42NTgtMS44MTUgMjEuNTEyIDIxLjUxMiAwIDAgMS03LjUwOC01LjE0NiAyMy4yMzMgMjMuMjMzIDAgMCAxLTQuODY0LTguMDM3IDMwLjI1MyAzMC4yNTMgMCAwIDEtMS43MjctMTAuNDg3IDMwLjE0NCAzMC4xNDQgMCAwIDEgMS43MjctMTAuNDUyIDIzLjIzMyAyMy4yMzMgMCAwIDEgNC44NjQtOC4wMzcgMjEuNzE0IDIxLjcxNCAwIDAgMSA3LjUwOC01LjE2NCAyNC43MzUgMjQuNzM1IDAgMCAxIDkuNjU4LTEuODMzIDI1LjA3NyAyNS4wNzcgMCAwIDEgOS42NzYgMS44MTUgMjEuMzYzIDIxLjM2MyAwIDAgMSA3LjUyOSA1LjE2NCAyMy40MjIgMjMuNDIyIDAgMCAxIDQuODY1IDguMDU1IDMwLjE0NCAzMC4xNDQgMCAwIDEgMS43MjQgMTAuNDUxem0tMy43MzcgMGEyOC40NTkgMjguNDU5IDAgMCAwLTEuNDQ1LTkuMzc2IDIwLjAzNyAyMC4wMzcgMCAwIDAtNC4wODktNy4wNSAxNy42MjYgMTcuNjI2IDAgMCAwLTYuMzQ1LTQuNDI0IDIxLjE2OCAyMS4xNjggMCAwIDAtOC4xNzgtMS41MzMgMjEuMDczIDIxLjA3MyAwIDAgMC04LjE0MyAxLjUzMyAxNy43OTQgMTcuNzk0IDAgMCAwLTYuMzYzIDQuNDI0IDIwLjEgMjAuMSAwIDAgMC00LjEyNCA3LjA1IDI4LjE0NiAyOC4xNDYgMCAwIDAtMS40NjUgOS4zNzYgMjguMTA2IDI4LjEwNiAwIDAgMCAxLjQ2MyA5LjM5NCAyMC4xMjggMjAuMTI4IDAgMCAwIDQuMTI0IDcuMDMyIDE3LjYgMTcuNiAwIDAgMCA2LjM2MyA0LjQwNiAyMS4yODggMjEuMjg4IDAgMCAwIDguMTQzIDEuNTE2IDIxLjM4NCAyMS4zODQgMCAwIDAgOC4xNzgtMS41MTYgMTcuNDM5IDE3LjQzOSAwIDAgMCA2LjM0NS00LjQwNiAyMC4wNjIgMjAuMDYyIDAgMCAwIDQuMDg5LTcuMDMyIDI4LjQxOSAyOC40MTkgMCAwIDAgMS40NDctOS4zOTR6bTU3LjI0NiAwYTI5LjUxNCAyOS41MTQgMCAwIDEtMS43MjcgMTAuNCAyMi40NTUgMjIuNDU1IDAgMCAxLTQuODY1IDcuODU3IDIxLjA1MSAyMS4wNTEgMCAwIDEtNy41MjYgNC45NyAyNi4yIDI2LjIgMCAwIDEtOS42OCAxLjczaC0xOC4yMlY1LjEyMWgxOC4yMmEyNi4yIDI2LjIgMCAwIDEgOS42NzYgMS43MjcgMjEuMDUxIDIxLjA1MSAwIDAgMSA3LjUyNiA0Ljk3IDIyLjQ1NSAyMi40NTUgMCAwIDEgNC44NjUgNy44NjEgMjkuNDA2IDI5LjQwNiAwIDAgMSAxLjczMyAxMC4zNjR6bS0zLjczNiAwYTI3LjgzMyAyNy44MzMgMCAwIDAtMS40NDUtOS4zMDYgMTkuNCAxOS40IDAgMCAwLTQuMDg5LTYuOTA5IDE3LjQ3MSAxNy40NzEgMCAwIDAtNi4zNDUtNC4zIDIxLjgzMyAyMS44MzMgMCAwIDAtOC4xNzgtMS40OGgtMTQuNTk0djQ0LjAyNmgxNC41ODlhMjEuODMzIDIxLjgzMyAwIDAgMCA4LjE3OC0xLjQ4IDE3LjQ3IDE3LjQ3IDAgMCAwIDYuMzQ1LTQuMyAxOS40IDE5LjQgMCAwIDAgNC4wODktNi45MDkgMjcuOTQ5IDI3Ljk0OSAwIDAgMCAxLjQ1LTkuMzQyek0xODkuMzk4IDUybC0uMDcgM2gtMjkuODkyVjUuMTIxaDI5Ljg5MnYzaC0yNi4yNjFWMjguMjhoMjEuODU1djIuOTI2aC0yMS44NTVWNTJ6Ii8+PHBhdGggZGF0YS1uYW1lPSJQYXRoIDEiIGQ9Ik0zMTguNTEgMjkuNzYxYTIwLjUzMiAyMC41MzIgMCAwIDAgNS45NC0uNzkzIDEyLjc4NyAxMi43ODcgMCAwIDAgNC40NDEtMi4yNzQgOS44MTYgOS44MTYgMCAwIDAgMi43NjctMy41NiAxMS4xNDIgMTEuMTQyIDAgMCAwIC45NTItNC42ODhxMC01LjMyMy0zLjQ3Mi03Ljl0LTEwLjEzNC0yLjU3aC05LjEyOHYyMS43ODV6TTM0MC42NDcgNTVoLTMuMWEyLjMyMSAyLjMyMSAwIDAgMS0xLS4xOTQgMS45ODUgMS45ODUgMCAwIDEtLjc1OC0uNzIzTDMxOS43NzYgMzMuODVhNC43NjQgNC43NjQgMCAwIDAtLjU4Mi0uNjcgMi4yODQgMi4yODQgMCAwIDAtLjY3LS40NDEgMy40MzQgMy40MzQgMCAwIDAtLjg4MS0uMjI5IDkuMzY2IDkuMzY2IDAgMCAwLTEuMjUxLS4wNzFoLTYuNTE2VjU1aC0zLjYzM1Y1LjEyMWgxMi43NjFxOC42IDAgMTIuODg0IDMuMzMxdDQuMjgzIDkuNzgyYTEzLjQgMTMuNCAwIDAgMS0uOTg3IDUuMjE3IDEyLjIzNSAxMi4yMzUgMCAwIDEtMi44MzggNC4xNDIgMTQuODEgMTQuODEgMCAwIDEtNC40NzcgMi45MDcgMjEuMjE1IDIxLjIxNSAwIDAgMS01LjkgMS41MTYgNS43MSA1LjcxIDAgMCAxIDEuNTE2IDEuNDF6bTUyLjQ1Mi0yNC45NTdhMzAuMjUzIDMwLjI1MyAwIDAgMS0xLjcyMyAxMC40ODcgMjMuMjMzIDIzLjIzMyAwIDAgMS00Ljg2NSA4LjAzNyAyMS40NzUgMjEuNDc1IDAgMCAxLTcuNTI2IDUuMTQ2IDI1LjA3NyAyNS4wNzcgMCAwIDEtOS42OCAxLjgxNiAyNC45NDUgMjQuOTQ1IDAgMCAxLTkuNjU4LTEuODE1IDIxLjUxMiAyMS41MTIgMCAwIDEtNy41MDgtNS4xNDYgMjMuMjMzIDIzLjIzMyAwIDAgMS00Ljg2My04LjAzOCAzMC4yNTMgMzAuMjUzIDAgMCAxLTEuNzI3LTEwLjQ4NyAzMC4xNDQgMzAuMTQ0IDAgMCAxIDEuNzI3LTEwLjQ1MiAyMy4yMzMgMjMuMjMzIDAgMCAxIDQuODY0LTguMDM3IDIxLjcxNCAyMS43MTQgMCAwIDEgNy41MDgtNS4xNjQgMjQuNzM1IDI0LjczNSAwIDAgMSA5LjY1OC0xLjgzMyAyNS4wNzcgMjUuMDc3IDAgMCAxIDkuNjc2IDEuODE1IDIxLjM2MyAyMS4zNjMgMCAwIDEgNy41MjYgNS4xNjQgMjMuNDIyIDIzLjQyMiAwIDAgMSA0Ljg2OCA4LjA1NSAzMC4xNDQgMzAuMTQ0IDAgMCAxIDEuNzIzIDEwLjQ1MnptLTMuNzM3IDBhMjguNDYgMjguNDYgMCAwIDAtMS40NDUtOS4zNzYgMjAuMDM3IDIwLjAzNyAwIDAgMC00LjA4OS03LjA1IDE3LjYyNiAxNy42MjYgMCAwIDAtNi4zNDUtNC40MjQgMjEuMTY4IDIxLjE2OCAwIDAgMC04LjE3OC0xLjUzMyAyMS4wNzMgMjEuMDczIDAgMCAwLTguMTQzIDEuNTMzIDE3Ljc5NCAxNy43OTQgMCAwIDAtNi4zNjMgNC40MjQgMjAuMSAyMC4xIDAgMCAwLTQuMTI0IDcuMDUgMjguMTQ2IDI4LjE0NiAwIDAgMC0xLjQ2MyA5LjM3NiAyOC4xMDYgMjguMTA2IDAgMCAwIDEuNDY0IDkuMzk0IDIwLjEyOCAyMC4xMjggMCAwIDAgNC4xMjQgNy4wMzIgMTcuNiAxNy42IDAgMCAwIDYuMzYzIDQuNDA2IDIxLjI4OCAyMS4yODggMCAwIDAgOC4xNDMgMS41MTYgMjEuMzg0IDIxLjM4NCAwIDAgMCA4LjE3OC0xLjUxNiAxNy40MzkgMTcuNDM5IDAgMCAwIDYuMzQ1LTQuNDA2IDIwLjA2MiAyMC4wNjIgMCAwIDAgNC4wODktNy4wMzIgMjguNDE5IDI4LjQxOSAwIDAgMCAxLjQ0NS05LjM5NHptNDEuMDMxIDYuODM5bC0xMC4xNTItMjUuMmEyNS4xMzQgMjUuMTM0IDAgMCAxLTEuMDIyLTIuOTYxcS0uMjExLjg0Ni0uNDU4IDEuNmExNC40NDIgMTQuNDQyIDAgMCAxLS41MjkgMS4zOTJsLTEwLjE1NiAyNS4xNjl6TTQ0MS40MjcgNTVoLTIuNzg1YTEuMjI0IDEuMjI0IDAgMCAxLS44MTEtLjI2NCAxLjc1NCAxLjc1NCAwIDAgMS0uNDkzLS42ODdsLTUuODUxLTE0LjQ4OWgtMjQuNWwtNS44NTEgMTQuNDg4YTEuNTE0IDEuNTE0IDAgMCAxLS40OTMuNjcgMS4zMTIgMS4zMTIgMCAwIDEtLjg0Ni4yODJoLTIuNzVsMjAuNDEtNDkuODc5aDMuNTZ6bTUwLjMtMjQuOTU3YTI5LjUxNCAyOS41MTQgMCAwIDEtMS43MjcgMTAuNCAyMi40NTUgMjIuNDU1IDAgMCAxLTQuODYzIDcuODU3IDIxLjA1MSAyMS4wNTEgMCAwIDEtNy41MjYgNC45NyAyNi4yIDI2LjIgMCAwIDEtOS42NzYgMS43M2gtMTguMjI0VjUuMTIxaDE4LjIyNGEyNi4yIDI2LjIgMCAwIDEgOS42NzYgMS43MjcgMjEuMDUxIDIxLjA1MSAwIDAgMSA3LjUyNiA0Ljk3IDIyLjQ1NSAyMi40NTUgMCAwIDEgNC44NjUgNy44NjEgMjkuNDA2IDI5LjQwNiAwIDAgMSAxLjcyNyAxMC4zNjR6bS0zLjczNiAwYTI3LjgzMyAyNy44MzMgMCAwIDAtMS40NDUtOS4zMDYgMTkuNCAxOS40IDAgMCAwLTQuMDg5LTYuOTA5IDE3LjQ3MSAxNy40NzEgMCAwIDAtNi4zNDUtNC4zIDIxLjgzMyAyMS44MzMgMCAwIDAtOC4xNzgtMS40OGgtMTQuNTkzdjQ0LjAyNmgxNC41OTRhMjEuODMzIDIxLjgzMyAwIDAgMCA4LjE3OC0xLjQ4IDE3LjQ3IDE3LjQ3IDAgMCAwIDYuMzQ1LTQuMyAxOS40IDE5LjQgMCAwIDAgNC4wODktNi45MDkgMjcuOTQ5IDI3Ljk0OSAwIDAgMCAxLjQ0NS05LjM0MnoiLz48cGF0aCBkPSJNMjY5LjM3NiA2MGgtMTl2LTQuNWExLjUgMS41IDAgMCAwLTEuNS0xLjVoLTNhMS41IDEuNSAwIDAgMC0xLjUgMS41VjYwaC0xOVYwaDE5djQuNWExLjUgMS41IDAgMCAwIDEuNSAxLjVoM2ExLjUgMS41IDAgMCAwIDEuNS0xLjVWMGgxOXY2MHptLTIzLjUtMjZhMS41IDEuNSAwIDAgMC0xLjUgMS41djlhMS41IDEuNSAwIDAgMCAxLjUgMS41aDNhMS41IDEuNSAwIDAgMCAxLjUtMS41di05YTEuNSAxLjUgMCAwIDAtMS41LTEuNXptMC0yMGExLjUgMS41IDAgMCAwLTEuNSAxLjV2OWExLjUgMS41IDAgMCAwIDEuNSAxLjVoM2ExLjUgMS41IDAgMCAwIDEuNS0xLjV2LTlhMS41IDEuNSAwIDAgMC0xLjUtMS41em0tMjMuNSA0NS45MTdhNiA2IDAgMCAxLTUtNS45MTdWNmE2IDYgMCAwIDEgNS01LjkxN3ptNTAgMFYuMDgzYTYgNiAwIDAgMSA1IDUuOTE3djQ4YTYgNiAwIDAgMS01IDUuOTE2eiIvPjwvZz48L3N2Zz4='}
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
        schema={cartSchema(t)}
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