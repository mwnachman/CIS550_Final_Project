import axios from 'axios'
import React, {useState, useEffect} from "react"
import PropTypes from "prop-types"
import {
  CardContent,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core"

import {ResultContainer} from './Display.jsx'

import useStyles from '../style/browse'
import { columns,
        criteriaMenuItems,
        genreMenuItems } from '../constants/constants'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || "development"]

const BrowseWrapper = (props) => {
  const styles = useStyles()
  return <Browse styles={styles} {...props} />
}

const Browse = ({handleClick}) => {
  const [selectedGenre, setGenre] = useState("")
  const [selectedTrait, setTrait] = useState("")
  const [results, setResult] = useState([])
  const [displayResults, setDisplayResults] = useState(false)

  useEffect(() => {Number.isInteger(selectedGenre) && selectedTrait.length && grabResults()}, [selectedGenre])
  useEffect(() => {Number.isInteger(selectedGenre) && selectedTrait.length && grabResults()}, [selectedTrait])

  function handleGenreChange({ target: { value } }) {
    setGenre(value)
  }

  function handleTraitChange({ target: { value } }) {
    setTrait(value)
  }

  const grabResults = async () => {
    setDisplayResults(true)
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
      setResult(results)
    }
  }

  const styles = useStyles()
  return (
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
                onChange={handleGenreChange}
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
                onChange={handleTraitChange}
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
  );
}
Browse.propTypes = {
  handleClick: PropTypes.func
}

export default Browse
