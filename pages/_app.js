import React from 'react'

import App from 'next/app'
import Head from 'next/head'

import withRedux from 'next-redux-wrapper'
import { Provider } from 'react-redux'
import { initStore } from '../src/store'

import { ThemeProvider } from '@material-ui/core/styles'
import theme from '../src/theme'

import DisplayFlashToasts from '@bit/amazingdesign.react-redux-mui-starter.display-flash-toasts'
import { getConfigSSR } from '@bit/amazingdesign.utils.config'

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <React.Fragment>
        <Head>
          <title>{getConfigSSR('REACT_APP_TITLE')}</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <Provider store={this.props.store}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
            <DisplayFlashToasts />
          </ThemeProvider>
        </Provider>
      </React.Fragment>
    )
  }
}

export default withRedux(initStore)(MyApp)