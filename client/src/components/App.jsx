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
import * as config from '../../../config/server.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: []
    }
  }

  componentDidMount() {
    this.fetchAllAlbums()
  }

  async fetchAllAlbums() {
    const promise = await axios.get(`${APIRoot}/albums`)
    const status = promise.status
    if (status == 200) {
      const albums = promise.data
      this.setState({albums})
    }
  }

  render() {
    const { albums } = this.state
    return (
      <Router>
        <CssBaseline />
        <Navbar />
        <Switch>
          <Route exact path='/' render={() => (<TabComponent albums={albums}/>)}/>
          <Route path="*" component={() => <Redirect to="/"/>}/>
        </Switch>
      </Router>
    )
  }
}

export default App
