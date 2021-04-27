/* global process:false */
import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import axios from 'axios'
import { CssBaseline } from '@material-ui/core'

import Navbar from './Navbar.jsx'
import TabComponent from './Tabs.jsx'

const App = () => (
  <Router>
    <CssBaseline />
    <Navbar />
    <Switch>
      <Route exact path='/' render={() => (<TabComponent/>)}/>
      <Route path="*" component={() => <Redirect to="/"/>}/>
    </Switch>
  </Router>
)

export default App
