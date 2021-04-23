/* global process:false */
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
  Popper,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import useStyles from '../style/search'
// import * as config from '../../../config/server.json'


// const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']


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
      albums: [],
      radioValue: "artist"
    }
    this.handleChange = this.handleChange.bind(this)
    this.query = this.query.bind(this)
    this.searchAlbums = this.searchAlbums.bind(this)
  }

  handleChange({target: {value}}) {
    this.setState({searchTerm: value})
  }

  async query() {
    // Search and do something with results
  }

  async searchAlbums() {
    const promise = await axios.get(`${APIRoot}/searchArtist/Rage Against The Machine`)
    const status = promise.status
    if (status == 200) {
      const albums = promise.data
      console.log('albums ', albums)
      this.setState({albums})
    }
  }

  render() {
    const { styles } = this.props
    const { searchTerm,
            searchResults,
            radioValue } = this.state
    const open = searchTerm.length > 0
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
                  <Grid item xs={12}>
                    <Grid container
                          direction="column"
                          alignItems="flex-start"
                          justify="flex-start">
                      <Grid container
                            direction="column"
                            alignItems="flex-start"
                            justify="flex-start">
                        <Grid item xs={12}>
                          <Typography gutterBottom variant="h5" component="h2">
                            Search
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
                            <FormControl onSubmit={() => {}} className={styles.form}>
                              <Grid item xs={6}>
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
                                  <Popper open={open} anchorEl={document.getElementById('search-field')}>
                                    <Paper className={styles.paper}>
                                      {searchResults.slice(0,8).map(result => (
                                        <MenuItem key={result.id} onClick={() => this.select(result)}>
                                          <Typography noWrap>
                                            {result.title}
                                          </Typography>
                                        </MenuItem>)
                                      )}
                                    </Paper>
                                  </Popper>
                                </div>
                              </Grid>
                              <Grid item xs={6}>
                                <RadioGroup row
                                            name="search"
                                            value={radioValue}
                                            onChange={() => {}}>
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
                                  <FormControlLabel
                                    value="all"
                                    control={<Radio color="primary" />}
                                    label="All"
                                    labelPlacement="start"
                                  />
                                </RadioGroup>
                              </Grid>

                            </FormControl>
                          </Grid>
                        </Grid>

                      </Grid>
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
