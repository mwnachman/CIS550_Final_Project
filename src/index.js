import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {ThemeProvider} from '@material-ui/core'

import App from './components/App.jsx'
import theme from './style/theme'

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App/>
  </ThemeProvider>,
  document.getElementById('app')
)

if (module.hot) module.hot.accept()
