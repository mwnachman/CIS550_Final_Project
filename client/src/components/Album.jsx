import axios from 'axios'
import clsx from 'clsx';
import React from 'react'
import PropTypes from 'prop-types'
import {
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


// function st_pad_left(string,pad,length) {
//     return (new Array(length+1).join(pad)+string).slice(-length);
// }

// var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);

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
      tracks: []
    }
    this.getTracks = this.getTracks.bind(this)
  }

  componentDidMount() {
    this.getTracks(this.props.albumId)
  }

  async getTracks(albumId) {
    const promise = await axios.get(`${APIRoot}/searchAlbumAllSongs/${albumId}`)
    const status = promise.status
    if (status == 200) {
      const tracks = promise.data
      this.setState({tracks})
    }
  }

  render() {
    const {open, 
          styles,
          handleClose,
          albumName,
          releaseYear,
          albumArtUrl} = this.props
    return (
      <Modal open={open}
            onClose={handleClose}
            className={styles.root}>
        <Fade in={open}>
          <div className={styles.paper}>
            
            <Grid container
                  direction="column"
                  alignItems="flex-start"
                  justify="flex-start">
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

          </div>
        </Fade>
      </Modal>
    )
  }
}

export default AlbumWrapper
