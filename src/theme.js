import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

import { getConfigSSR } from '@bit/amazingdesign.utils.config'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: getConfigSSR('REACT_APP_THEME_COLOR_PRIMARY') || '#556cd6',
    },
    secondary: {
      main: getConfigSSR('REACT_APP_THEME_COLOR_SECONDARY') || '#19857b',
    },
    error: {
      main: getConfigSSR('REACT_APP_THEME_COLOR_ERROR') || red.A400,
    },
    background: {
      default: getConfigSSR('REACT_APP_THEME_COLOR_BACKGROUND') || '#fff',
    },
  },
})

export default theme
