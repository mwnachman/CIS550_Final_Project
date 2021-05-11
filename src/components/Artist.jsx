import axios from 'axios'
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

import {Headers} from './Display.jsx'
import {artistModalColumns} from '../constants/constants'
import useStyles from '../style/artist'
import * as config from "../../config/client.json";

const APIRoot = config.BASE_URL[process.env.NODE_ENV || "development"];

const AlbumListing = ({ album, headers }) => (
  <TableRow>
    {headers.map((header, i) => { 
       return (
        <TableCell key={i} style={headers.style}>
          {album[header['label']]}
        </TableCell>
        )
    })}
  </TableRow>
);
AlbumListing.propTypes = {
  album: PropTypes.object,
  headers: PropTypes.array
};

const ArtistWrapper = props => {
  const styles = useStyles()
  return <Artist styles={styles} {...props} />
}

class Artist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: []
    }
  }

  componentDidMount() {
    this.getAlbums(this.props.artistId)
  }

  async getAlbums(artistId) {
    const promise = await axios.get(`${APIRoot}/searchArtistAlbums/${artistId}`)
    const status = promise.status
    if (status == 200) {
      const albums = promise.data
      this.setState({albums})
    }
  }

  render() {
    const {open, styles, handleClose, artistName} = this.props
    const {albums} = this.state
    return (
      <Modal open={open}
            onClose={handleClose}
            className={styles.root}>
        <Fade in={open}>
          <div className={styles.paper}>
            
            {albums.length ?
              <Grid container
              direction="column"
              alignItems="flex-start"
              justify="flex-start"
              className={styles.exterior_grid}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Albums by {artistName}
                  </Typography>
                </Grid>
                <Grid item xs={12} className={styles.interior_grid}>
                  <TableContainer className={styles.interior_grid}>
                    <Table>
                      <TableHead>
                        <Headers styles={styles.headers} columns={artistModalColumns}/>
                      </TableHead>
                      <TableBody>
                      {this.state.albums.map((album, i) => (
                        <AlbumListing key={i} album={album} headers={artistModalColumns} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              :
              <Grid item xs={12} className={styles.root}>
                <CircularProgress/>
              </Grid>
            }
          </div>
        </Fade>
      </Modal>
    )
  }
}
Artist.propTypes = {
  artistId: PropTypes.string,
  artistName: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool, 
  styles: PropTypes.object,
}

export default ArtistWrapper
