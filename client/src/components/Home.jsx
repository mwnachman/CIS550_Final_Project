import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import useStyles from '../style/home'

const Home = ({changeTab}) => {
  const styles = useStyles();
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
            <CardMedia
              className={styles.media}
              image="/assets/albums_background.jpg"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                About Us
              </Typography>
              <Typography variant="body2" color="textSecondary" variant="h6" component="p">
                Welcome to [APP NAME].  <Link onClick={() => changeTab(1)}>Browse</Link> or <Link onClick={() => changeTab(2)}>Search</Link> by artist, album or song.
                Want to find new music?  Check out <Link onClick={() => changeTab(3)}>Recommendations</Link>.
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>

      </Grid>   

    </Grid> 
  )
}
Home.propTypes = {}

export default Home
