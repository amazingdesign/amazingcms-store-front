import redirect from 'nextjs-redirect'
import { getConfigSSR } from '@bit/amazingdesign.utils.config'

const PRODUCTS_COLLECTION = getConfigSSR('REACT_APP_DEFAULT_PRODUCTS_COLLECTION')

export default redirect(PRODUCTS_COLLECTION ? `/${PRODUCTS_COLLECTION}` : '/products')