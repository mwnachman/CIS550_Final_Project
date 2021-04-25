import React from 'react'
import PropTypes from 'prop-types'
import {
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'

import useStyles from '../style/recommendations'

const Recommendations = () => {
  const styles = useStyles();

  if (true) {
    return (
      <Paper className={styles.root}>
        <TableContainer className={styles.container}>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell className={styles.header}
                             key={column.id}
                             style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {setlist['song'].map((song, i) => (
                <TableRow key={i}>
                  <TableCell key={song.name}>
                    {song.name}
                  </TableCell>
                  <TableCell key={song.info}>
                    {song.info ? song.info : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    )
  } return <LinearProgress />
}
Recommendations.propTypes = {}

export default Recommendations
