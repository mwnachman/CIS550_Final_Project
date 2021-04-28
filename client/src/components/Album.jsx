import axios from 'axios'
import clsx from 'clsx';
import React from 'react'
import PropTypes from 'prop-types'
import {
  CircularProgress,
  Fade,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'

import {Headers} from './Search.jsx'
import {tracklistHeaders} from '../constants/constants'
import useStyles from '../style/album'
import * as config from "../../config/client.json";

const APIRoot = config.BASE_URL[process.env.NODE_ENV || "development"];

const Track = ({ track, headers }) => (
  <TableRow>
    {headers.map((header, i) => { 
       return (
        <TableCell key={i} style={{minWidth: headers.minWidth}}>
          {track[header['label']]}
        </TableCell>
        )
    })}
  </TableRow>
);
Track.propTypes = {
  track: PropTypes.object,
  headers: PropTypes.array
};

const AlbumWrapper = props => {
  const styles = useStyles()
  return <Album styles={styles} {...props} />
}

class Album extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tracks: [],
      albumArt: {}
    }
    this.getTracks = this.getTracks.bind(this)
    this.getArt = this.getArt.bind(this)
  }

  componentDidMount() {
    const {albumId} = this.props
    this.getTracks(albumId)
    this.getArt(albumId)
  }

  async getTracks(albumId) {
    const promise = await axios.get(`${APIRoot}/searchAlbumAllSongs/${albumId}`)
    const status = promise.status
    if (status == 200) {
      const tracks = promise.data
      this.setState({tracks})
    }
  }

  async getArt(albumId) {
    const promise = await axios.get(`${APIRoot}/searchAlbum/${albumId}/art`)
    const status = promise.status
    if (status == 200) {
      const albumArt = promise.data.album_image
      this.setState({albumArt})
    }
  }

  render() {
    const {open, 
          styles,
          handleClose,
          albumName,
          releaseYear} = this.props
    const {albumArt} = this.state
    let coverArt = albumArt && albumArt.url 
    return (
      <Modal open={open}
            onClose={handleClose}
            className={styles.root}>
        <Fade in={open}>
          <div className={styles.paper}>
            

            {coverArt ?
              <Grid container
                    direction="column"
                    alignItems="flex-start"
                    justify="flex-start">
                <Grid item xs={12} >
                  <img src={coverArt} className={styles.art}/>
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {albumName}
                  </Typography>
                  <Typography gutterBottom component="p">
                    Released {releaseYear}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <Headers styles={styles.headers} columns={tracklistHeaders}/>
                      </TableHead>
                      <TableBody>
                      {this.state.tracks.map((track, i) => (
                        <Track key={i} track={track} headers={tracklistHeaders} />
                      ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              :
              <Grid item xs={12} className={styles.root}>
                <CircularProgress className={styles.spinner}/>
              </Grid>
            }
          </div>
        </Fade>
      </Modal>
    )
  }
}

export default AlbumWrapper
