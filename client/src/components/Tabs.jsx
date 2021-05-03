import React from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import {
  AppBar,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'

import Browse from './Browse.jsx'
import Home from './Home.jsx'
import Search from './Search.jsx'
import Album from './Album.jsx'
import Artist from './Artist.jsx'


class TabComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      artistForModal: {},
      albumForModal: {},
      artistModalOpen: false,
      albumModalOpen: false,
      modalType: ''
    }
    this.openArtistModal = this.openArtistModal.bind(this)
    this.openAlbumModal = this.openAlbumModal.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.changeTab = this.changeTab.bind(this)
  }

  handleClose() {
    this.setState({
      artistModalOpen: false,
      albumModalOpen: false,
      artistForModal: {},
      albumForModal: {}
    })
  }

  handleClick(result, type) {
    if (type == 'artist_name') {
      this.openArtistModal(result)
    } else if (type == 'album_name') {
      this.openAlbumModal(result)
    } 
  }

  openArtistModal(artistForModal) {
    this.setState({artistForModal, artistModalOpen: true})
  }

  openAlbumModal(albumForModal) {
    this.setState({albumForModal, albumModalOpen: true})
  }

  changeTab(e) {
    let newLocation = e.target.textContent.toLowerCase()
    this.props.history.push(`/${newLocation}`)
  }

  render() {
    const { artistForModal,
            artistModalOpen,
            albumForModal,
            albumModalOpen } = this.state
    let pathname = this.props.history.location.pathname

    return (
      <div>

        <AppBar position="static">
          <Paper square>

            <Tabs value={pathname == '/home' ? 0 : pathname == '/browse' ? 1 : 2}
                  textColor="primary"
                  indicatorColor="primary"
                  onChange={this.changeTab} >
              <Tab label="Home" index={0}/>
              <Tab label="Browse" index={1}/>
              <Tab label="Search" index={2}/>
            </Tabs>

          </Paper>
        </AppBar>

        {artistModalOpen &&
          <Artist open={artistModalOpen}
                  handleClose={this.handleClose}
                  artistId={artistForModal.artist_id}
                  artistName={artistForModal.artist_name}/>
        }

        {albumModalOpen &&
          <Album open={albumModalOpen}
                  handleClose={this.handleClose}
                  albumId={albumForModal.album_id}
                  albumName={albumForModal.album_name}
                  releaseYear={albumForModal.release_year}/>
        }

        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/browse' component={Browse}/>
          <Route path='/search' component={Search}/>
        </Switch>

      </div>
    )
  }
}
TabComponent.propTypes = {
  setlist: PropTypes.array
}

const TabsWithRouter = withRouter(TabComponent)

export default TabsWithRouter
