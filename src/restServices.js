/* eslint-disable max-lines */
import makeRestServices, { crudActionsDeclarations } from 'redux-rest-services'

import axios from './axios'
import { addErrorHandler } from './restServicesErrorHandler'

import { flashMessage } from 'redux-flash'
import { i18n } from './i18n'

import { getConfigSSR } from '@bit/amazingdesign.utils.config'

const API_URL = getConfigSSR('REACT_APP_API_URL')
const PRODUCTS_COLLECTION = getConfigSSR('REACT_APP_PRODUCTS_COLLECTION')

const servicesDeclarations = [
  {
    name: 'products',
    url: `${API_URL}/actions/${PRODUCTS_COLLECTION}/:id`,
    transformer: (data) => data && data.rows,
    actionsDeclarations: crudActionsDeclarations,
    onReceivesData: ({ method, name }, dispatch) => {
      if (['find'].includes(name)) {
        dispatch(flashMessage(
          typeof window === 'undefined' ?
            i18n.t('Data fetched on server!')
            :
            i18n.t('Data fetched by browser!')
        ))
      }
    },
  },
]

const restServicesDeclarationsWithErrorHandlers = addErrorHandler(servicesDeclarations)

const fetchFunction = (...all) => (
  axios(...all)
    .then(response => response.data)
    .catch(error => {
      console.log('axios error', error)
      return Promise.reject(error && error.response && error.response.data)
    })
)

export const restServices = makeRestServices(
  restServicesDeclarationsWithErrorHandlers,
  fetchFunction
)

export default restServices