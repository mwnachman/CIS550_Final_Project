/* global process:false */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  FormControlLabel,
  Grid,
  InputBase,
  LinearProgress,
  Link,
  MenuItem,
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

import Album from './Album.jsx'
import Artist from './Artist.jsx'
import Recommendations from './Recommendations.jsx'

import {columns} from '../constants/constants'
import useStyles from '../style/search'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

export const NoResult = ({text}) => (
  <TableRow>
    <TableCell style={{borderBottom: 'none'}}>
      {!text ? "No Results" : text}
    </TableCell>
  </TableRow>
)

class GetRecs extends React.Component {
  constructor(props) {
    super(props)
    this.selectSong = this.selectSong.bind(this)
  }

  selectSong(e) {
    e.preventDefault()
    this.props.handleClick(this.props.song)
  }

  render() {
    return (
      <Button variant="outlined"
              color="primary"
              disableElevation
              disableRipple
              onClick={this.selectSong}>
        Get Recs
      </Button>
    )
  }
}
GetRecs.propTypes = {
  handleClick: PropTypes.func
}

export const Headers = ({styles, columns}) => (
  <TableRow>
    {columns && columns.map((column, i) => (
      <TableCell className={styles}
                 key={i}
                 style={{ minWidth: column.minWidth }}>
        {column.header}
      </TableCell>
    ))}
  </TableRow>
)
Headers.propTypes = {
  styles: PropTypes.object,
  resultType: PropTypes.string
}

const SearchForm = ({query,
                    styles,
                    handleChange,
                    searchTerm,
                    radioValue,
                    handleRadioChange}) => (
  <Grid container
        direction="row"
        alignItems="flex-start"
        justify="flex-start">
    <Grid item xs={12}>
      <Grid container
        direction="row"
        alignItems="flex-start"
        justify="flex-start">
        <form onSubmit={query}>
          <FormControl className={styles.form}>
            <Grid item xs={6} >
              <SearchBase styles={styles}
                          handleChange={handleChange}
                          searchTerm={searchTerm}/>
            </Grid>
            <Grid item xs={6} style={{minWidth: "100%"}}>
              <RadioGroup row
                          name="search"
                          value={radioValue}
                          onChange={handleRadioChange}>
                <FormControlLabel
                  value="song"
                  control={<Radio color="primary" />}
                  label="Song"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="artist"
                  control={<Radio color="primary" />}
                  label="Artist"
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
)
SearchForm.propTypes = {
  query: PropTypes.func,
  styles: PropTypes.object,
  handleChange: PropTypes.func,
  searchTerm: PropTypes.string,
  radioValue: PropTypes.string,
  handleRadioChange: PropTypes.func
}

const SearchBase = ({styles, handleChange, searchTerm}) => (
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
               onChange={handleChange}
              />
  </div>
)
SearchBase.propTypes = {
  handleChange: PropTypes.func,
  search: PropTypes.func,
  searchTerm: PropTypes.string,
  styles: PropTypes.object
}

const ResultContainer = ({styles,
                          columns,
                          searchResults,
                          getRecs,
                          resultType,
                          selectSong,
                          handleClick}) => (
  <Grid container
        direction="row"
        alignItems="flex-start"
        justify="flex-start">
    <Grid item xs={12}>

      <TableContainer>
        <Table aria-label="sticky table">

          <TableHead>
            <Headers styles={styles.header} columns={columns[resultType]}/>
          </TableHead>

          <TableBody>
            {searchResults.map((result, i) => (
              <SearchResult result={result}
                            headers={columns[resultType]}
                            key={i}
                            styles={styles}
                            getRecs={getRecs}
                            handleClick={handleClick}/>
            ))}
            {!!resultType && !searchResults.length && (
              <NoResult/>
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </Grid>
  </Grid>
)
ResultContainer.propTypes = {
  getRecs: PropTypes.func,
  columns: PropTypes.object,
  resultType: PropTypes.string,
  searchResults: PropTypes.array,
  styles: PropTypes.object
}

export class SearchResult extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(type) {
    const {result} = this.props
    this.props.handleClick(result, type)
  }

  render() {
    const {result,
           headers,
           getRecs,
           styles} = this.props
    return (
      <TableRow>
        {headers.map((header, i) => {
          if (header.label == 'review_url') {
            return (
              <TableCell key={i} style={{minWidth: headers.minWidth}}>
                {result.review_url &&
                  <Link href={result.review_url}
                        target="_blank">
                    Read Review
                  </Link>
                }
              </TableCell>
            )
          } else if (header.label == 'artist_name' ||
              header.label == 'album_name') {
            return (
              <TableCell key={i} style={{minWidth: headers.minWidth}}>
                <Link href="#" onClick={() => this.handleClick(header['label'])}>
                  {result[header['label']]}
                </Link>
              </TableCell>
            )
          } else {
            return (
            <TableCell key={i} style={{minWidth: headers.minWidth}}>
              {!!header['label'] ?
                result[header['label']] :
                <GetRecs song={result} handleClick={getRecs}/>
              }
            </TableCell>
            )
          }
        })}
      </TableRow>
    )
  }
}
SearchResult.propTypes = {
  result: PropTypes.object,
  headers: PropTypes.array,
  getRecs: PropTypes.func,
  isSong: PropTypes.bool
}


const SearchWrapper = props => {
  const styles = useStyles()
  return <SearchCard styles={styles} {...props} />
}

class SearchCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      searchResults: [],
      resultsType: "",
      radioValue: "song",
      showRecs: false,
      selectedSong: {},
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.query = this.query.bind(this)
    this.searchAlbums = this.searchAlbums.bind(this)
    this.searchSongs = this.searchSongs.bind(this)
    this.searchArtists = this.searchArtists.bind(this)
    this.getRecs = this.getRecs.bind(this)
  }

  handleChange({target: {value}}) {
    this.setState({searchTerm: value})
  }

  handleRadioChange({target: {value}}) {
    this.setState({radioValue: value})
  }

  getRecs(selectedSong) {
    this.setState({selectedSong, showRecs: true})
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
    this.setState({
      searchTerm: "",
      showRecs: false
    })
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
    const { styles, handleClick } = this.props
    const { radioValue,
            resultType,
            searchTerm,
            searchResults,
            showRecs,
            selectedSong,
            artistForModal,
            artistModalOpen,
            albumForModal,
            albumModalOpen } = this.state
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
                image="/assets/recommendations.jpg"
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

                <SearchForm query={this.query}
                            styles={styles}
                            handleChange={this.handleChange}
                            searchTerm={searchTerm}
                            radioValue={radioValue}
                            handleRadioChange={this.handleRadioChange}/>
                
                {showRecs ?
                  <Recommendations getRecs={this.getRecs}
                                   handleClick={handleClick}
                                   selectedSong={selectedSong}/> 
                  :
                  <ResultContainer styles={styles}
                                   columns={columns}
                                   searchResults={searchResults}
                                   getRecs={this.getRecs}
                                   resultType={resultType}
                                   handleClick={handleClick}/>
                }

              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>   
      </Grid> 
    )
  }
}
SearchCard.propTypes = {
  styles: PropTypes.object
}

export default SearchWrapper
