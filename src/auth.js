import { flashMessage, flashErrorMessage } from 'redux-flash'

import axios from './axios'
import { i18n } from './i18n'

import { getConfigSSR } from '@bit/amazingdesign.utils.config'
import { makeReduxAuth } from '@bit/amazingdesign.react-redux-mui-starter.make-redux-auth'
import { makeAuthRequests } from '@bit/amazingdesign.react-redux-mui-starter.make-auth-requests'

const API_URL = getConfigSSR('REACT_APP_API_URL')
const LOG_IN_URL = API_URL + '/auth/logIn'
const REFRESH_TOKEN_URL = API_URL + '/auth/refreshToken'
const FORGOT_PASSWORD_URL = API_URL + '/auth/sendForgotPasswordEmail'
const RESET_PASSWORD_URL = API_URL + '/auth/resetPassword'

const t = i18n.t.bind(i18n)

const flashSuccessMessage = (message, options) => flashMessage(message, { ...options, props: { variant: 'success' } })

export const {
  logIn,
  logOut,
  refreshTokens,
  getAccessToken,
  checkIfLoggedIn,
  sendForgotPasswordEmail,
  resetPassword,
} = makeAuthRequests({
  loginRequestFunction: (email, password) => (
    axios.post(LOG_IN_URL, { email, password })
  ),
  refreshTokenRequestFunction: (refreshToken) => (
    axios.post(REFRESH_TOKEN_URL, { refreshToken })
  ),
  forgotPasswordRequestFunction: (email) => axios.post(FORGOT_PASSWORD_URL, { email }),
  resetPasswordRequestFunction: (password, data) => (
    axios.post(RESET_PASSWORD_URL, { password, passwordResetToken: data.passwordResetToken })
  ),
})

export const {
  logInAsyncAction,
  logOutAsyncAction,
  checkIfLoggedInAsyncAction,
  sendForgotPasswordEmailAsyncAction,
  setUserDataAction,
  userIsLoggingInAction,
  userLoginFailureAction,
  setUserIsLoggedInAction,
  setUserIsLoggedOutAction,
  resetPasswordAsyncAction,
  reducer,
} = makeReduxAuth(
  { logIn, logOut, checkIfLoggedIn, sendForgotPasswordEmail, resetPassword },
  { flashMessage, flashErrorMessage, flashSuccessMessage },
  t
)