import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core'

import useStyles from '../style/navbar'

const Navbar = () => {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <AppBar className={styles.appbar} position='static'>
        <Toolbar className={styles.bar}>
          <Typography variant='h6'
                      noWrap>
            <span style={{fontFamily: 'Rubik Mono One', fontSize: '30px'}}>Sonalysis</span>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar