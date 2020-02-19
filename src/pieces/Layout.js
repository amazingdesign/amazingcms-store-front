import React from 'react'
import PropTypes from 'prop-types'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { useTranslation } from 'react-i18next'
import { getConfigSSR } from '@bit/amazingdesign.utils.config'

const styles = {
  root: {
    maxWidth: 1024,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
  logo: {
    maxWidth: 200,
    maxHeight: 37,
    objectFit: 'contain',
  },
}

const languages = JSON.parse(getConfigSSR('REACT_APP_LANGUAGES') || '[]')
const LanguageSwitcher = dynamic(
  () => import('@bit/amazingdesign.react-redux-mui-starter.language-switcher'),
  { ssr: false }
)

const PRODUCTS_COLLECTION = getConfigSSR('REACT_APP_DEFAULT_PRODUCTS_COLLECTION')

const Layout = ({ children, coupon }) => {
  const { t } = useTranslation(undefined, { useSuspense: false })

  return (
    <>
      <div style={styles.root}>
        <Link
          href={{ pathname: '/[collectionName]', query: coupon ? { coupon } : {} }}
          as={`/${PRODUCTS_COLLECTION}${coupon ? `?coupon=${coupon}` : ''}`}
        >
          <a>
            <img
              src={'https://backend.staging.coderoad.pl/api/downloader/files/5e4d6dbeb30a840011c744d5'}
              alt={'Store Logo'}
              style={styles.logo}
            />
          </a>
        </Link>
        <LanguageSwitcher
          noLabel={true}
          languages={languages.map((language) => ({ ...language, name: t(language.name) }))}
        />
      </div>
      {children}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  coupon: PropTypes.string,
}

export default Layout