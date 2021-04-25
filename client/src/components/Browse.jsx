import React from 'react'
import PropTypes from 'prop-types'
import {
  LinearProgress,
  Paper,
} from '@material-ui/core'

import useStyles from '../style/browse'

const Browse = ({albums}) => {
  const styles = useStyles();
  if (albums) {
    return (
      <Paper className={styles.root}>
      </Paper>
    )
  } return <LinearProgress />
}
Browse.propTypes = {
  albums: PropTypes.array
}

export default Browse
