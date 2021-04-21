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


const useStyles = makeStyles({
  root: {
    maxWidth: 700,
  },
  media: {
    height: 140,
  },
});


const Home = () => {
  const styles = useStyles();
  return (
    <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '70vh' }}>

      <Grid item xs={8}>

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
                Welcome to [APP NAME].  <Link>Browse</Link> or <Link>Search</Link> by artist, album or song.
                Want to find new music?  Check out <Link>Recommendations</Link>.
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
