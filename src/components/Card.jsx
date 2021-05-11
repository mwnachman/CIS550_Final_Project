import React from 'react'
import PropTypes from 'prop-types'
import {Card,
        CardActionArea,
        CardMedia,
        Grid} from '@material-ui/core'

import useStyles from '../style/card'


const PageCard = ({cardImgUrl, children}) => {
  const styles = useStyles()
  return (
    <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          className={styles.exterior_grid}>
      <Grid item xs={8} className={styles.interior_grid}>
        <Card className={styles.root}>
          <CardActionArea>
            <CardMedia className={styles.media} image={cardImgUrl}/>

            {children}
           
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  )
}
PageCard.propTypes = {
  cardImg: PropTypes.string,
  children: PropTypes.node,
}

export default PageCard
