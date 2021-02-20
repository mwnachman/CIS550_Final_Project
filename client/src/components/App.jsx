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
import Popular from './Popular.jsx'
import * as config from '../../../config/server.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      band: '',
      date: '',
      venue: ''
    }
  }

  componentDidMount() {
    this.fetchLastBeatlesSetlist()
  }

  async fetchLastBeatlesSetlist() {
    const beatlesID = 'b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d'
    const promise = await axios.get(`${APIRoot}/setlists/${beatlesID}`)
    const status = promise.status
    if (status == 200) {
      const setlist = promise.data.setlist[0]
      this.saveSetlistInfo(setlist)
    }
  }

  saveSetlistInfo(setlist) {
    this.setState({ setlist: setlist['sets']['set'][0],
                    band: setlist['artist']['name'],
                    date: setlist['eventDate'],
                    venue: setlist['venue']['name']
                  })
  }

  render() {
    const { setlist, band, date,venue } = this.state
    return (
      <Router>
        <CssBaseline />
        <Navbar band={band} date={date} venue={venue}/>
        <Switch>
          <Route path='/popular' render={() => (<Popular setlist={setlist}/>)}/>
          <Route path="*" component={() => <Redirect to="/popular"/>}/>
        </Switch>
      </Router>
    )
  }
}

export default App
