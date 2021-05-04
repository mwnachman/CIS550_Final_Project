import axios from "axios";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from "@material-ui/core";

import Artist from './Artist.jsx'
import useStyles from '../style/home'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || "development"];

export class RandomResult extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    this.props.handleClick(this.props.result)
  }

  render() {
    const {result} = this.props
    return (
  <TableRow>
    <TableCell style={{ minWidth: "30vh" }}><Link href="#" onClick={this.handleClick}>{result.artist_name}</Link></TableCell>
    <TableCell style={{ minWidth: "30vh" }}>{result.album_name}</TableCell>
    <TableCell style={{ minWidth: "30vh" }}>{result.song_name}</TableCell>
    <TableCell style={{ minWidth: "20vh" }}>
      {result.album_release_year}
    </TableCell>
  </TableRow>
    )
  }
}
RandomResult.propTypes = {
  result: PropTypes.object,
};

const ResultContainer = ({ styles, results, handleClick }) => (
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
                Song Title
              </TableCell>
              <TableCell
                className={styles}
                style={{ minWidth: "20vh", fontWeight: "bold" }}
              >
                Release Year
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {results.map((result, i) => (
              <RandomResult key={i} result={result} handleClick={handleClick} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  </Grid>
);
ResultContainer.propTypes = {
  styles: PropTypes.object,
  results: PropTypes.array,
};

const HomeWrapper = (props) => {
  const styles = useStyles();
  return <Home styles={styles} {...props} />;
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGenre: "",
      results: [],
      artistForModal: {},
      modalOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.setState({
      modalOpen: false,
      artistForModal: {}
    })
  }

  handleClick(artistForModal) {
    this.setState({artistForModal, modalOpen: true})
  }

  handleChange({ target: { value } }) {
    this.setState({ selectedGenre: value }, this.getRandom);
  }

  async getRandom() {
    const promise = await axios.get(
      `${APIRoot}/getGenre/${this.state.selectedGenre}`
    );
    const status = promise.status;
    if (status == 200) {
      const randomResults = promise.data;
      this.setState({ results: randomResults });
    }
  }

  render() {
    const { styles } = this.props;
    const { selectedGenre, results, artistForModal, modalOpen } = this.state;
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
        {modalOpen &&
            <Artist open={modalOpen}
                    handleClose={this.handleClose}
                    artistId={artistForModal.artist_id}
                    artistName={artistForModal.artist_name}/>
            
          }
          <Card className={styles.root}>
            <CardActionArea>
              <CardMedia
                className={styles.media}
                image="/assets/albums_background.jpg"
              />
              <CardContent>
                <Typography gutterBottom
                            variant="h5"
                            component="h2"
                            className={styles.welcome}>
                  Welcome to <span className={styles.sonalysis}>Sonalysis</span>. 
                </Typography>
                <Typography className={styles.userQuery}>
                  Not sure where to start? Choose a genre to get random recommendations.
                </Typography>
                <FormControl className={styles.formControl}>
                  <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedGenre}
                    onChange={this.handleChange}
                  >
                    <MenuItem value={8}>Alternative Rock &amp; Pop</MenuItem>
                    <MenuItem value={4}>Country &amp; Folk</MenuItem>
                    <MenuItem value={3}>Dance &amp; Electronic</MenuItem>
                    <MenuItem value={2}>Hip-Hop</MenuItem>
                    <MenuItem value={5}>Jazz</MenuItem>
                    <MenuItem value={7}>Metal &amp; Punk</MenuItem>
                    <MenuItem value={6}>Other</MenuItem>
                    <MenuItem value={1}>R&amp;B</MenuItem>
                    <MenuItem value={0}>Rock &amp; Pop</MenuItem>
                  </Select>
                </FormControl>
                <ResultContainer results={results} handleClick={this.handleClick} />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default HomeWrapper;
