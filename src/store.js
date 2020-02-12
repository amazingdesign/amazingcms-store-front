import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { reducer as flashReducer, middleware as flashMiddleware, removeMessage } from 'redux-flash'
import { makeCart } from 'redux-simple-cart'
import { restServices } from './restServices'

const FLASH_MESSAGES_DEFAULT_TIMEOUT = 5000

const clearFlashMessagesAfterTimeout = (initialState, store) => {
  if (initialState && initialState.flash && initialState.flash.messages && initialState.flash.messages.length) {
    initialState.flash.messages.forEach(({ id }) => {
      setTimeout(
        () => store.dispatch(removeMessage(id)),
        FLASH_MESSAGES_DEFAULT_TIMEOUT
      )
    })
  }
}

export const initStore = (initialState = {}, { isServer }) => {
  const mainReducer = combineReducers({
    flash: flashReducer,
    cart: makeCart('cart').reducer,
    ...restServices.reducers,
  })

  const rootReducer = (state, action) => {
    return mainReducer(state, action)
  }

  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        flashMiddleware({ timeout: FLASH_MESSAGES_DEFAULT_TIMEOUT }),
        thunk,
      )
    )
  )

  !isServer && clearFlashMessagesAfterTimeout(initialState, store)

  return store
}