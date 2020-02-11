import React from 'react'

import { useTranslation } from 'react-i18next'

import { getService } from '@bit/amazingdesign.redux-rest-services.get-service'
import { useServiceLoaded } from '@bit/amazingdesign.redux-rest-services.use-service-loaded'
import { makeSrc } from '@bit/amazingdesign.amazingcms.make-downloader-src'

import ProductGrid from '../src/bits/store-front/ProductGrid'
import Cart from '../src/bits/store-front/Cart'

const UseServiceLoadedPage = (props) => {
  const { t } = useTranslation(undefined, { useSuspense: false })

  const { Loader, data: products } = useServiceLoaded('products', { doNotLoadOnMount: true })

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
            addToCartClick={console.log}
            addToCartLabel={t('Add to cart')}
          />
        </Loader>
      </div>
      <Cart 
        tooltip={t('Open cart')}
        closeLabel={t('Close')}
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