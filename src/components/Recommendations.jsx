/* global process:false */
import axios from 'axios'
import clsx from 'clsx'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Checkbox,
  Grid,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'

import { Headers,
         NoResult,
         SearchResult } from './Display.jsx'

import {songAttributes, recommendedSongHeaders} from '../constants/constants'
import useStyles from '../style/recommendations'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']



const RecommendedSongs = ({songs,
                          styles,
                          returnToSliders,
                          handleClick}) => {
  if (songs.length) {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={styles.noBottomBorder}>
              <Button size="small"
                      variant="contained"
                      color="primary"
                      onClick={returnToSliders}>
                Return to Sliders
              </Button>
            </TableCell>
          </TableRow>
          <Headers styles={styles.header} columns={recommendedSongHeaders}/>
        </TableHead>
        <TableBody>
          {songs.map((song, i) => {
            return (
              <SearchResult result={song}
                            key={i}
                            handleClick={handleClick}
                            headers={recommendedSongHeaders}/>
            )
          })}
        </TableBody>
      </Table>
    )
  } else {
    return (
      <TableBody>
        <TableRow>
          <TableCell>
            <NoResult text="No matching songs found - try including more search parameters"/>
          </TableCell>
          <TableCell>
            <Button size="small"
                    variant="contained"
                    color="primary"
                    onClick={returnToSliders}>
              Return to Sliders
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }
}

const Parameter = ({attribute,
                    setValues,
                    values,
                    i,
                    checked,
                    handleCheckboxChange,
                    styles}) => {
  
  function sliderChange(e, newValue) {
    setValues(Object.assign([], values, {[i]: newValue}))
  }

  function checkboxChange() {
    handleCheckboxChange(Object.assign([], checked, {[i]: !checked[i]}))
  }

  return (
    <TableRow>
      <TableCell className={styles.label}>
        {attribute.label}
      </TableCell>

      <TableCell className={styles.min}>
        {attribute.min}
      </TableCell>

      <TableCell className={styles.slider}>
        <Slider value={parseFloat(values[i])}
                valueLabelDisplay="auto"
                min={attribute.min}
                max={attribute.max}
                step={attribute.step}
                onChange={sliderChange}/>
      </TableCell>

      <TableCell className={styles.max}>
        {attribute.max}
      </TableCell>
      
      <TableCell className={styles.description}>
        {attribute.description}
      </TableCell>

      <TableCell className={styles.include}>
        <Checkbox className={styles.checkbox}
                  color="default"
                  checked={checked[i]}
                  onChange={checkboxChange}
                  checkedIcon={<span className={clsx(styles.icon, styles.checkedIcon)} />}
                  icon={<span className={styles.icon} />}/>
        Include
      </TableCell>
    </TableRow>
  )
}
Parameter.propTypes = {
  attribute: PropTypes.object,
  values: PropTypes.array,
  setValues: PropTypes.func,
  i: PropTypes.number,
  checked: PropTypes.array,
  handleCheckboxChange: PropTypes.func,
  styles: PropTypes.object
}

const RecommendationWrapper = props => {
  const styles = useStyles()
  return <Recommendations styles={styles} {...props} />
}

class Recommendations extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: [0,0,0,0,0,0,0,0,0],
      initialValues: [0,0,0,0,0,0,0,0,0,0],
      genreChecked: true,
      checked: [true, true, true, true, true, true, true, true, true],
      songs: [],
      searchedForRecs: false,
    }
  }

  componentDidMount() {
    const {selectedSong} = this.props
    if (selectedSong) {
      this.getSongDetails(selectedSong.song_id)
    }
  }

  setParameterValues = values => {
    this.setState({values})
  }

  handleGenreCheckboxChange = () => {
    this.setState({genreChecked: !this.state.genreChecked})
  }

  handleCheckboxChange = checked => {
    this.setState({checked})
  }

  returnToSliders = () => {
    this.setState({
      searchedForRecs: false,
      values: this.state.initialValues,
      checked: [true, true, true, true, true, true, true, true, true],
      genreChecked: true,
    })
  }

  submit = e => {
    e.preventDefault()
    const {checked, genreChecked, values} = this.state
    let params = {}
    params.include = {}
    params.include.genre = genreChecked
    songAttributes.forEach((attribute, i) => params.include[attribute.dbName] = checked[i])
    params.sliderValues = {}
    songAttributes.forEach((attribute, i) => params.sliderValues[attribute.dbName] = values[i])
    params.songInfo = this.props.selectedSong
    this.getRecommendations(params)
  }

  async getSongDetails(id) {
    const promise = await axios.get(`${APIRoot}/songDetails/${id}`)
    const status = promise.status
    if (status == 200) {
      const songDetails = promise.data[0]
      let initialValues = songAttributes.map(attribute => songDetails[attribute['dbName']])
      this.setState({initialValues, values: initialValues})
    }
  }

  async getRecommendations(params) {
    const promise = await axios.get(`${APIRoot}/recommendSongs/`, {
      params
    })
    const status = promise.status
    if (status == 200) {
      const songs = promise.data
      this.setState({songs, searchedForRecs: true})
    }
  }

  render() {
    const { selectedSong,
          handleClick,
          styles } = this.props
    const { values,
          songs,
          genreChecked,
          searchedForRecs,
          checked } = this.state
    return (
      <Grid container
            direction="column"
            alignItems="flex-start"
            justify="flex-start"
            className={styles.exterior_grid}>
        <Grid item xs={12} className={styles.interior_grid}>
          <Typography className={styles.recsWording} component="p">
            Get recommendations based on your selected song,
          </Typography>
          <Typography component="p">
            or tweak the levels to get custom recommendations...
          </Typography>

          <TableContainer>
            <Table aria-label="sticky table">

              <TableHead>
                <TableRow>
                  <TableCell className={styles.selectedSong}>
                    "{selectedSong.song_name}" by {selectedSong.artist_name} on "{selectedSong.album_name}"
                  </TableCell>
                  {!searchedForRecs &&
                    <TableCell className={styles.buttonCell}>
                      <Button size="small"
                              variant="contained"
                              color="primary"
                              onClick={this.submit}>
                        Show Similar
                      </Button>
                    </TableCell>
                  }
                  {!searchedForRecs &&
                    <TableCell>
                      <Checkbox
                        className={styles.checkbox}
                        color="default"
                        checked={genreChecked}
                        onChange={this.handleGenreCheckboxChange}
                        checkedIcon={<span className={clsx(styles.icon, styles.checkedIcon)} />}
                        icon={<span className={styles.icon} />}
                        inputProps={{ 'aria-label': 'decorative checkbox' }}
                      />
                      Match Genre
                    </TableCell>
                  }
                </TableRow>
              </TableHead>
            </Table>
            <Table>
              {searchedForRecs ?
                <RecommendedSongs songs={songs}
                                  styles={styles}
                                  handleClick={handleClick}
                                  returnToSliders={this.returnToSliders}/>
                :
                <TableBody>
                  {songAttributes.map((attribute, i) => (
                    <Parameter styles={styles}
                                attribute={attribute}
                                i={i}
                                key={i}
                                checked={checked}
                                values={values}
                                handleCheckboxChange={this.handleCheckboxChange}
                                setValues={this.setParameterValues}/>)
                  )}
                </TableBody>
              }
            </Table>
          </TableContainer>

        </Grid>
      </Grid> 
    )
  }
}
Recommendations.propTypes = {
  selectedSong: PropTypes.object,
  handleClick: PropTypes.func,
  
}

export default RecommendationWrapper
