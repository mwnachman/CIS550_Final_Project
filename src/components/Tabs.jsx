import React from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'

import Browse from './Browse.jsx'
import Search from './Search.jsx'
import Album from './Album.jsx'
import Artist from './Artist.jsx'


const TabPanel = props => {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel"
          hidden={value !== index}
          id={`scrollable-force-tabpanel-${index}`}
          {...other}>
      {value === index && (
        <div>
          {children}
        </div>
      )}
    </div>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


function a11yProps(index) {
  return {
    id: `nav-tab-${index}`
  }
}

class TabComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabPosition: 0,
      artistForModal: {},
      albumForModal: {},
      artistModalOpen: false,
      albumModalOpen: false,
      modalType: ''
    }
  }

  handleClose = () => {
    this.setState({
      artistModalOpen: false,
      albumModalOpen: false,
      artistForModal: {},
      albumForModal: {}
    })
  }

  handleClick = (result, type) => {
    if (type == 'artist_name') {
      this.openArtistModal(result)
    } else if (type == 'album_name') {
      this.openAlbumModal(result)
    } 
  }

  openArtistModal = artistForModal => {
    this.setState({artistForModal, artistModalOpen: true})
  }

  openAlbumModal = albumForModal => {
    this.setState({albumForModal, albumModalOpen: true})
  }

  handleChange = (e, newValue) => {
    e.preventDefault()
    this.setState({tabPosition: newValue})
  }

  render() {
    const { tabPosition,
            artistForModal,
            artistModalOpen,
            albumForModal,
            albumModalOpen } = this.state
    return (
      <div>
        <AppBar position="static">
          <Paper square>
            <Tabs
              value={tabPosition}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleChange}
            >
              <Tab label="Browse" {...a11yProps(0)}/>
              <Tab label="Search" {...a11yProps(1)}/>
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
        <TabPanel value={tabPosition} index={0}>
          <Browse handleClick={this.handleClick}/>
        </TabPanel>
        <TabPanel value={tabPosition} index={1}>
          <Search handleClick={this.handleClick}/>
        </TabPanel>
      </div>
    )
  }
}
TabComponent.propTypes = {
  setlist: PropTypes.array
}

export default TabComponent
