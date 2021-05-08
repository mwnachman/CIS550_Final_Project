import axios from 'axios';
import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";

import {ResultContainer} from './Display.jsx'

import useStyles from '../style/browse'
import { columns,
        criteriaMenuItems,
        genreMenuItems } from '../constants/constants'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || "development"];

const BrowseWrapper = (props) => {
  const styles = useStyles()
  return <Browse styles={styles} {...props} />
}

class Browse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedGenre: "",
      selectedTrait: "",
      results: [],
      displayResults: false,
    }
  }

  handleGenreChange = ({ target: { value } }) => {
    this.setState({ selectedGenre: value },
      this.grabResults
    )
  }

  handleTraitChange = ({ target: { value } }) => {
    this.setState({ selectedTrait: value },
      this.grabResults
    )
  }

  async grabResults() {
    // check to make sure both selects have values
    const {selectedTrait, selectedGenre} = this.state
    if (Number.isInteger(selectedGenre) && selectedTrait.length) {
      this.displayResults()
      // determine which endpoint to call based on selectedTrait value
      let appropriateUrl = APIRoot
      if (selectedTrait == 'top') {
        appropriateUrl += `/top5/${selectedGenre}`
      } else {
        appropriateUrl += `/traitByGenre/${selectedGenre}/${selectedTrait}`
      }
      const promise = await axios.get(appropriateUrl)
      const status = promise.status
      if (status == 200) {
        const results = promise.data
        this.setState({ results: results })
      } 
    }
  }

  displayResults = () => {
    this.setState({ displayResults: true })
  }

  render() {
    const { styles, handleClick } = this.props
    const { selectedGenre,
            selectedTrait,
            displayResults,
            results } = this.state
    
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
              <CardMedia className={styles.media} image="/assets/browse.jpg"/>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Browse
                </Typography>
                <Typography color="textSecondary"
                            variant="h6"
                            component="p">
                  Check out some of the top albums from each year by genre and your specified criteria.
                </Typography>
                <FormControl className={styles.formControl}>
                  <InputLabel id="demo-simple-select-genre-label">Genre</InputLabel>
                  <Select value={selectedGenre}
                          onChange={this.handleGenreChange}
                          autoWidth={true}>
                    {genreMenuItems.map(item => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.text}
                      </MenuItem>)
                    )}
                  </Select>
                </FormControl>
                <FormControl className={styles.formControl}>
                  <InputLabel id="demo-simple-select-criteria-label">Criteria</InputLabel>
                  <Select value={selectedTrait}
                          onChange={this.handleTraitChange}
                          autoWidth={true}>
                    {criteriaMenuItems.map(item => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.text}
                      </MenuItem>)
                    )}
                  </Select>
                </FormControl>
                {displayResults &&
                  <ResultContainer styles={styles}
                                   results={results}
                                   columns={columns}
                                   resultType={results.length ? "album_abbreviated" : undefined}
                                   noResultText="Please select a genre"
                                   handleClick={handleClick} />}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
Browse.propTypes = {
  styles: PropTypes.object,
  handleClick: PropTypes.func
}

export default BrowseWrapper;
