import React from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core'
import AlbumIcon from '@material-ui/icons/Album'

import useStyles from '../style/navbar'


const Navbar = () => {
  const styles = useStyles()
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
        </Toolbar>
      </AppBar>
    </div>
  )
}

Navbar.propTypes = {
}

export default Navbar