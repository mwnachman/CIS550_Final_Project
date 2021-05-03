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
      <Route path='/home' render={() => (<TabComponent/>)}/>
      <Route path='/browse' render={() => (<TabComponent/>)}/>
      <Route path='/search' render={() => (<TabComponent/>)}/>
      <Route exact path='/' component={() => <Redirect to='/home'/>}/>
      <Route path='*' component={() => <Redirect to='/home'/>}/>
    </Switch>
  </Router>
)

export default App
