import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'

import Navbar from './Navbar.jsx'
import TabComponent from './Tabs.jsx'

const App = () => (
  <Router>
    <CssBaseline />
    <Navbar />
    <Switch>
      <Route exact path='/' component={TabComponent}/>
      <Route path="*" component={() => <Redirect to="/"/>}/>
    </Switch>
  </Router>
)

export default App
