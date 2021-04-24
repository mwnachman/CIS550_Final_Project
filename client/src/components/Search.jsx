/* global process:false */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  FormControlLabel,
  Grid,
  InputBase,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import useStyles from '../style/search'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']


const columns = {
  artist: [
    {
      header:'Artist Name',
      label: 'Artist',
      minWidth: '30vh'
    },
    {
      header: 'Number of Albums',
      label: 'Album_count',
      minWidth: '10vh'
    },
    {
      header: 'Number of Songs',
      label: 'Song_count',
      minWidth: '10vh'
    }
  ],
  song: [
    {
      header: 'Song',
      label: 'Song',
      minWidth: '30vh'
    },
    {
      header: 'Artist',
      label: 'Artist',
      minWidth: '30vh'
    },
    {
      header: 'Album',
      label: 'Album',
      minWidth: '30vh'
    }
  ],
  album: [
    {
      header: 'Album',
      label: 'Album',
      minWidth: '30vh'
    },
    {
      header: 'Artist',
      label: 'Artist',
      minWidth: '30vh'
    },
    {
      header: 'Format',
      label: 'Format',
      minWidth: '30vh'
    },
    {
      header: 'Record Label',
      label: 'Record_Label',
      minWidth: '30vh'
    }
  ]
}

const Headers = ({styles, resultType}) => (
  <TableRow>
    {
      columns[resultType] &&
      columns[resultType].map(column => (
        <TableCell className={styles}
                   key={column.label}
                   style={{ minWidth: column.minWidth }}>
          {column.header}
        </TableCell>
      ))
    }
  </TableRow>
)

const SearchResult = ({result, headers}) => (
  <TableRow>
    {headers.map((header, i) => {
      return (
      <TableCell key={i} style={{minWidth: headers.minWidth}}>
        {result[header['label']]}
      </TableCell>
      )
    })}
  </TableRow>
)

const SearchWrapper = props => {
  const styles = useStyles()
  return <Search styles={styles} {...props} />
}

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      searchResults: [],
      resultsType: "",
      radioValue: "artist"
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.query = this.query.bind(this)
    this.searchAlbums = this.searchAlbums.bind(this)
    this.searchSongs = this.searchSongs.bind(this)
    this.searchArtists = this.searchArtists.bind(this)
  }

  handleChange({target: {value}}) {
    this.setState({searchTerm: value})
  }

  handleRadioChange({target: {value}}) {
    this.setState({radioValue: value})
  }

  query(e) {
    e.preventDefault();
    switch (this.state.radioValue) {
      case 'artist':
        this.searchArtists();
        break;
      case 'album':
        this.searchAlbums();
        break;
      case 'song':
        this.searchSongs();
        break;
      default:
        console.error(`Error`);
    }
    this.setState({searchTerm: ""})
  }

  async searchArtists() {
    this.setState({resultType: 'artist'})
    const promise = await axios.get(`${APIRoot}/searchArtist/${this.state.searchTerm}`)
    const status = promise.status
    if (status == 200) {
      const artists = promise.data
      this.setState({searchResults: artists})
    }
  }

  async searchSongs() {
    this.setState({resultType: 'song'})
    const promise = await axios.get(`${APIRoot}/searchSong/${this.state.searchTerm}`)
    const status = promise.status
    if (status == 200) {
      const songs = promise.data
      this.setState({searchResults: songs})
    }
  }

  async searchAlbums() {
    this.setState({resultType: 'album'})
    const promise = await axios.get(`${APIRoot}/searchAlbum/${this.state.searchTerm}`)
    const status = promise.status
    if (status == 200) {
      const albums = promise.data
      this.setState({searchResults: albums})
    }
  }

  render() {
    const { styles } = this.props
    const { radioValue,
            resultType,
            searchTerm,
            searchResults } = this.state
    if (true) {
      return (
        <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          className={styles.exterior_grid}>

          <Grid item xs={12} className={styles.interior_grid}>
            
            <Card className={styles.root}>
              <CardActionArea>
                <CardMedia
                  className={styles.media}
                  image="/assets/search_music.jpg"
                />

                <CardContent>

                  <Grid container
                        direction="column"
                        alignItems="flex-start"
                        justify="flex-start">
                    <Grid item xs={12}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Search for an album, artist or song...
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container
                        direction="row"
                        alignItems="flex-start"
                        justify="flex-start">
                    <Grid item xs={12}>
                      <Grid container
                        direction="row"
                        alignItems="flex-start"
                        justify="flex-start">
                        <form onSubmit={this.query}>
                          <FormControl className={styles.form}>
                            <Grid item xs={6} >
                              <div className={styles.search} >
                                <div className={styles.searchIcon}>
                                  <SearchIcon />
                                </div>
                                <InputBase placeholder='Search...'
                                           id='search-field'
                                           autoComplete='off'
                                           value={searchTerm}
                                           classes={{
                                             root: styles.inputRoot,
                                             input: styles.inputTypeSearch
                                           }}
                                           inputProps={{ 'aria-label': 'search' }}
                                           onChange={this.handleChange}
                                           />
                              </div>
                            </Grid>
                            <Grid item xs={6} style={{minWidth: "100%"}}>
                              <RadioGroup row
                                          name="search"
                                          value={radioValue}
                                          onChange={this.handleRadioChange}>
                                <FormControlLabel
                                  value="artist"
                                  control={<Radio color="primary" />}
                                  label="Artist"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  value="song"
                                  control={<Radio color="primary" />}
                                  label="Song"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  value="album"
                                  control={<Radio color="primary" />}
                                  label="Album"
                                  labelPlacement="start"
                                />
                              </RadioGroup>
                            </Grid>
                          </FormControl>
                        </form>

                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container
                        direction="row"
                        alignItems="flex-start"
                        justify="flex-start">
                    <Grid item xs={12}>

                      <TableContainer className={styles.container}>
                        <Table aria-label="sticky table">

                          <TableHead>
                            <Headers styles={styles.header} resultType={resultType}/>
                          </TableHead>

                          <TableBody>
                            {searchResults.map((result, i) => (
                              <SearchResult result={result}
                                            headers={columns[resultType]}
                                            key={i}/>
                            ))}
                            {!!resultType && !searchResults.length && (
                              <TableRow>
                                <TableCell style={{borderBottom: 'none'}}>
                                  No Results
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>

                        </Table>
                      </TableContainer>

                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>   
        </Grid> 
      )
    }
    <LinearProgress />
  }
}

Search.propTypes = {}

export default SearchWrapper
