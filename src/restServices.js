/* eslint-disable max-lines */
import makeRestServices, { crudActionsDeclarations } from 'redux-rest-services'

import axios from './axios'
import { addErrorHandler } from './restServicesErrorHandler'

import { getConfigSSR } from '@bit/amazingdesign.utils.config'

import { flashMessage, flashErrorMessage } from 'redux-flash'
import i18n from './i18n'

const API_URL = getConfigSSR('REACT_APP_API_URL')

const servicesDeclarations = [
  {
    name: 'products',
    url: `${API_URL}/actions/:collectionName/:id`,
    transformer: (data) => data && data.rows,
    actionsDeclarations: crudActionsDeclarations,
  },
  {
    name: 'orders',
    url: `${API_URL}/orders/:id`,
    actionsDeclarations: crudActionsDeclarations,
    onError: ({ method, name }, dispatch) => {
      if (name === 'create') dispatch(flashErrorMessage(i18n.t('Failed to create order!')))
    },
    onReceivesData: ({ method, name }, dispatch) => {
      if (name === 'create') dispatch(flashMessage(i18n.t('Order created successfully!')))
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

export const restServices = (
  // fixes problem with NextJS automatic prerendering and envs
  /// https://github.com/zeit/next.js/issues/8014
  process.env.NEXT_PHASE !== 'phase-production-build' &&
  makeRestServices(
    restServicesDeclarationsWithErrorHandlers,
    fetchFunction
  )
)

export default restServices