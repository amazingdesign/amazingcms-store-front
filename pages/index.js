import React from 'react'

import { useTranslation } from 'react-i18next'

import { getInstances } from 'redux-simple-cart'
import { useDispatch, useSelector } from 'react-redux'

import { flashMessage } from 'redux-flash'
import { flashSuccessMessage } from '@bit/amazingdesign.react-redux-mui-starter.flash-success-message'
import { getService } from '@bit/amazingdesign.redux-rest-services.get-service'
import { useServiceLoaded } from '@bit/amazingdesign.redux-rest-services.use-service-loaded'
import { makeSrc } from '@bit/amazingdesign.amazingcms.make-downloader-src'

import ProductGrid from '../src/bits/store-front/ProductGrid'
import Cart from '../src/bits/store-front/Cart'

const UseServiceLoadedPage = (props) => {
  const { t } = useTranslation(undefined, { useSuspense: false })

  const dispatch = useDispatch()
  const items = useSelector((store) => store.cart.items)
  const [{ actions: cart }] = getInstances()

  const { Loader, data: products } = useServiceLoaded('products', { doNotLoadOnMount: true })

  const addToCart = (product) => {
    dispatch(cart.add(product._id, product))
    dispatch(flashSuccessMessage('Added to cart!'))
  }
  const removeFromCart = (product) => {
    dispatch(cart.remove(product._id))
    dispatch(flashMessage('Removed from cart!'))
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Loader>
          <ProductGrid
            products={products.map((product) => ({
              ...product,
              price: String(product.price),
              photo: makeSrc('files')(product.photo),
            }))}
            addToCartClick={(e, product) => addToCart(product)}
            addToCartLabel={t('Add to cart')}
          />
        </Loader>
      </div>
      <Cart
        tooltip={t('Open cart')}
        closeLabel={t('Close')}
        buttonLabel={t('Pay')}
        defaultCurrency={t('$')}
        emptyCartMessage={t('Empty cart! Add some items!')}
        items={items}
        addItem={(product) => addToCart({ ...product, quantity: 1 })}
        removeItem={(product) => removeFromCart(product)}
      />
    </>
  )
}

UseServiceLoadedPage.getInitialProps = async ({ store }) => {
  const { find } = getService(store, 'products')

  const result = await find()

  return { result }
}

export default UseServiceLoadedPage