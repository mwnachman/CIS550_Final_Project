/* global process:false */
import React from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Popper,
  Toolbar,
  Typography
} from '@material-ui/core'
import AlbumIcon from '@material-ui/icons/Album'
import SearchIcon from '@material-ui/icons/Search'

import useStyles from '../style/navbar'
import * as config from '../../../config/server.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

const NavbarWrapper = props => {
  const styles = useStyles()
  return <Navbar styles={styles} {...props} />
}

class Navbar extends React.Component {
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
    return (
      <div className={styles.root}>
        <AppBar className={styles.lightBlue} position='static'>
          <Toolbar>
            <IconButton edge='start'>
              <AlbumIcon />
            </IconButton>
            <Typography className={styles.title}
                        variant='h6'
                        noWrap>
              NAME - TBD
            </Typography>
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
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
Navbar.propTypes = {
}

export default NavbarWrapper
