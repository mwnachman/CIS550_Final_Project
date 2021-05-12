import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'

import Album from './Album.jsx'
import Artist from './Artist.jsx'
import Browse from './Browse.jsx'
import PageCard from './Card.jsx'
import Search from './Search.jsx'


const TabPanel = ({children, value, index}) => (
  <div role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}>
    {value === index && (
      <div>
        {children}
      </div>
    )}
  </div>
)
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const TabComponent = () => {
  const [tabPosition, setTabPosition] = useState(0)
  const [artistForModal, setArtistForModal] = useState(undefined)
  const [albumForModal, setAlbumForModal] = useState(undefined)
  const [artistModalOpen, setArtistModalOpen] = useState(false)
  const [albumModalOpen, setAlbumModalOpen] = useState(false)

  function handleClose() {
    setArtistModalOpen(false)
    setAlbumModalOpen(false)
    setArtistForModal(undefined)
    setAlbumForModal(undefined)
  }

  function handleClick(result, type) {
    if (type == 'artist_name') {
      openArtistModal(result)
    } else if (type == 'album_name') {
      openAlbumModal(result)
    } 
  }

  function openArtistModal(artistForModal) {
    setArtistForModal(artistForModal)
    setArtistModalOpen(true)
  }

  function openAlbumModal(albumForModal) {
    setAlbumForModal(albumForModal)
    setAlbumModalOpen(true)
  }

  function handleChange(e, newValue) {
    e.preventDefault()
    setTabPosition(newValue)
  }


  return (
    <div>
      
      <AppBar position="static">
        <Paper square>
          <Tabs value={tabPosition}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}>
            <Tab label="Browse" id="nav-tab-0"/>
            <Tab label="Search" id="nav-tab-1"/>
          </Tabs>
        </Paper>
      </AppBar>

      {artistModalOpen &&
        <Artist open={artistModalOpen}
                handleClose={handleClose}
                artistId={artistForModal.artist_id}
                artistName={artistForModal.artist_name}/>
        
      }
      {albumModalOpen &&
        <Album open={albumModalOpen}
                handleClose={handleClose}
                albumId={albumForModal.album_id}
                albumName={albumForModal.album_name}
                releaseYear={albumForModal.release_year}/>
        
      }

      <TabPanel value={tabPosition} index={0}>
        <PageCard cardImgUrl="./assets/browse.png">
          <Browse handleClick={handleClick}/>
        </PageCard>
      </TabPanel>
      <TabPanel value={tabPosition} index={1}>
        <PageCard cardImgUrl="./assets/recommendations.png">
          <Search handleClick={handleClick}/>
        </PageCard>
      </TabPanel>

    </div>
  )
}

export default TabComponent
