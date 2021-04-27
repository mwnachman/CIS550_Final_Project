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


import Artist from './Artist.jsx'
import * as config from "../../config/client.json";

const APIRoot = config.BASE_URL[process.env.NODE_ENV || "development"];

const BrowseResult = ({ result }) => (
  <TableRow>
    <TableCell style={{ minWidth: "30vh" }}>{result.artist_name}</TableCell>
    <TableCell style={{ minWidth: "30vh" }}>{result.album_name}</TableCell>
    <TableCell style={{ minWidth: "30vh" }}>{result.album_release_year}</TableCell>
    <TableCell style={{ minWidth: "20vh" }}>
      {result.rank}
    </TableCell>
  </TableRow>
);
BrowseResult.propTypes = {
  result: PropTypes.object,
};

const BrowseResultContainer = ({ styles, results }) => (
  <Grid container direction="row" alignItems="flex-start" justify="flex-start">
    <Grid item xs={12}>
      <TableContainer>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                className={styles}
                style={{ minWidth: "30vh", fontWeight: "bold" }}
              >
                Artist
              </TableCell>
              <TableCell
                className={styles}
                style={{ minWidth: "30vh", fontWeight: "bold" }}
              >
                Album
              </TableCell>
              <TableCell
                className={styles}
                style={{ minWidth: "30vh", fontWeight: "bold" }}
              >
                Release Year
              </TableCell>
              <TableCell
                className={styles}
                style={{ minWidth: "20vh", fontWeight: "bold" }}
              >
                Rank
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, i) => (
              <BrowseResult key={i} result={result} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  </Grid>
);
BrowseResultContainer.propTypes = {
  styles: PropTypes.object,
  results: PropTypes.array,
};

const BrowseWrapper = (props) => {
  const styles = useStyles();
  return <Browse styles={styles} {...props} />;
};

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGenre: "",
      selectedTrait: "",
      results: [],
      displayResults: false
    };
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.handleTraitChange = this.handleTraitChange.bind(this);
    this.displayResults = this.displayResults.bind(this);
    this.grabResults = this.grabResults.bind(this);
  }

  handleGenreChange({ target: { value } }) {
    this.setState({ selectedGenre: value },
      this.grabResults
    );
  }

  handleTraitChange({ target: { value } }) {
    this.setState({ selectedTrait: value },
      this.grabResults
    );
  }

  grabResults() {
    // check to make sure both selects have values
    if (this.state.selectedGenre > -1 && this.state.selectedTrait.length > 0) {
      this.displayResults()
    }
  }

  displayResults() {
    this.setState({ displayResults: true });
  }

  render() {
    const { styles } = this.props;
    const { selectedGenre, selectedTrait, displayResults } = this.state;
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
                <Artist/>

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
                    onChange={this.handleGenreChange}
                    autowidth="true"
                  >
                    <MenuItem value={0} selected="true">Rock &amp; Pop</MenuItem>
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
                <FormControl className={styles.formControl}>
                  <InputLabel id="demo-simple-select-label">Criteria</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedTrait}
                    onChange={this.handleTraitChange}
                    autowidth="true"
                  >
                    <MenuItem value="top" selected="true">Top Overall in Genre</MenuItem>
                    <MenuItem value="danceability">Most Danceable</MenuItem>
                    <MenuItem value="energy">Most Energetic</MenuItem>
                    <MenuItem value="loudness">Loudest</MenuItem>
                    <MenuItem value="acousticness">Most Acoustic</MenuItem>
                  </Select>
                </FormControl>
                {displayResults ?
                <Typography>Results Displayed</Typography>
                :
                <Typography>No results</Typography>
                }
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default BrowseWrapper;
