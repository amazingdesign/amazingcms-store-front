import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

import axios from 'axios'

import { ServerStyleSheets } from '@material-ui/core/styles'
import theme from '../src/theme'

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="pl">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />

          {
            this.props.envConfig ?
              <script dangerouslySetInnerHTML={{ __html: this.props.envConfig }}></script>
              :
              <script src={'/env-config.js'}></script>
          }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Download env-config.js
  let envConfig = null
  try {
    // eslint-disable-next-line no-undef
    envConfig = await axios(`${process.env.SELF_URL}/env-config.js`).then((response) => response.data)
  } catch (error) {
    console.error('Cant load /env-config.js to inline this script! Will be attached in head in <script> tag!')
  }

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    envConfig,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  }
}
