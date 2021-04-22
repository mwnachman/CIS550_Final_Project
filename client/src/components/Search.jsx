/* global process:false */
import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  InputBase,
  LinearProgress,
  MenuItem,
  Paper,
  Popper,
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
      searchResults: []
    }
    this.query = this.query.bind(this)
  }

  async query({target: {value}}) {
    this.handleChange(value)
    // Search and do something with results
  }

  handleChange(searchTerm) {
    this.setState({searchTerm})
  }

  render() {
    const { styles } = this.props
    const { searchTerm, searchResults } = this.state
    const open = searchTerm.length > 0
    if (true) {
      return (
        <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          className={styles.exterior_grid}>

          <Grid item xs={6} className={styles.interior_grid}>
            <Card className={styles.root}>
              <CardActionArea>
                <CardMedia
                  className={styles.media}
                  image="/assets/search_music.jpg"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Search
                  </Typography>
                  <Typography variant="body2" color="textSecondary" variant="h6" component="p">
                    
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div className={styles.search}>
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
                           onChange={this.query}/>
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
