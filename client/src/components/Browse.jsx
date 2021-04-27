import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useStyles from "../style/browse";

const BrowseWrapper = (props) => {
  const styles = useStyles();
  return <Browse styles={styles} {...props} />;
};

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGenre: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target: { value } }) {
    this.setState({ selectedGenre: value });
  }

  render() {
    const { styles } = this.props;
    const { selectedGenre } = this.state;
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        className={styles.exterior_grid}
      >
        <Grid item xs={8} className={styles.interior_grid}>
          <Card className={styles.root}>
            <CardActionArea>
              <CardMedia
                className={styles.media}
                image="/assets/albums_background.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Browse
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  variant="h6"
                  component="p"
                >
                  Check out some of the top albums from each year by genre.
                </Typography>
                <FormControl className={styles.formControl}>
                  <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedGenre}
                    onChange={this.handleChange}
                  >
                    <MenuItem value={0}>Rock &amp; Pop</MenuItem>
                    <MenuItem value={1}>R&amp;B</MenuItem>
                    <MenuItem value={2}>Hip-Hop</MenuItem>
                    <MenuItem value={3}>Dance &amp; Electronic</MenuItem>
                    <MenuItem value={4}>Country &amp; Folk</MenuItem>
                    <MenuItem value={5}>Jazz</MenuItem>
                    <MenuItem value={6}>Other</MenuItem>
                    <MenuItem value={7}>Metal &amp; Punk</MenuItem>
                    <MenuItem value={8}>Alternative Rock &amp; Pop</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default BrowseWrapper;
