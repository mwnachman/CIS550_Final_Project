/* global process:false */
import axios from 'axios'
import clsx from 'clsx';
import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Checkbox,
  Grid,
  Input,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'


import {songAttributes} from '../constants/constants'
import useStyles from '../style/recommendations'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

class Parameter extends React.Component {
  constructor(props) {
    super(props)
    this.handleSliderChange = this.handleSliderChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleSliderChange(event, newValue) {
    let newState = this.props.values
    newState[this.props.i] = newValue
    this.props.setValues(newState)
  }

  handleInputChange({target: {value}}) {
    let newState = this.props.values
    newState[this.props.i] = value
    this.props.setValues(newState)
  }

  render () {
    const {attribute,
          values,
          initialValues,
          i,
          styles} = this.props
    return (
      <TableRow>
        <TableCell>
          {attribute.label}
        </TableCell>
        <TableCell>
          {attribute.min}
        </TableCell>
        <TableCell className={styles.slider}>
          <Slider
            value={parseFloat(values[i])}
            min={attribute.min}
            max={attribute.max}
            step={attribute.step/10}
            onChange={this.handleSliderChange}
            aria-labelledby="input-slider"
          />
        </TableCell>
        <TableCell>
          {attribute.max}
        </TableCell>
        <TableCell >
          <Input
            className={styles.input}
            value={values[i]}
            margin="dense"
            onChange={this.handleInputChange}
            inputProps={{
              step: attribute.step,
              min: attribute.min,
              max: attribute.max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </TableCell>
        <TableCell className={styles.description}>
          {attribute.description}
        </TableCell>
      </TableRow>
    )
  }
}
Parameter.propTypes = {

}

const RecommendationWrapper = props => {
  const styles = useStyles()
  return <Recommendations styles={styles} {...props} />
}

class Recommendations extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      songDetails: {},
      values: [0,0,0,0,0,0,0,0,0],
      initialValues: [0,0,0,0,0,0,0,0,0],
      checked: true
    }
    this.getSongDetails = this.getSongDetails.bind(this)
    this.setParameterValues = this.setParameterValues.bind(this)
    this.submit = this.submit.bind(this)
    this.getRecommendations = this.getRecommendations.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
  }

  componentDidMount() {
    const {selectedSong} = this.props
    if (selectedSong) {
      this.getSongDetails(selectedSong.song_id)
    }
  }

  setParameterValues(values) {
    this.setState({values})
  }

  submit(e) {
    e.preventDefault()
    let params = 
    this.getRecommendations(params)
  }

  handleCheckboxChange() {
    this.setState({checked: !this.state.checked})
  }

  async getSongDetails(id) {
    const promise = await axios.get(`${APIRoot}/songDetails/${id}`)
    const status = promise.status
    if (status == 200) {
      const songDetails = promise.data[0]
      let initialValues = songAttributes.map(attribute => songDetails[attribute['dbName']])
      initialValues.unshift(this.props.selectedSong['release_year'])
      this.setState({
                    songDetails,
                    initialValues,
                    values: initialValues
                   })
    }
  }

  async getRecommendations(params) {
    // const promise = await axios.get(`${APIRoot}/recommendSongs/${id}`)
    // const status = promise.status
    // if (status == 200) {
    //   const songDetails = promise.data[0]
    //   let initialValues = songAttributes.map(attribute => songDetails[attribute['dbName']])

    //   this.setState({songDetails,
    //                 initialValues,
    //                 values: initialValues})
    // }
  }

  render() {
    const {selectedSong, styles} = this.props
    const {values,
          initialValues,
          checked} = this.state
    return (
      <Grid container
            direction="column"
            alignItems="flex-start"
            justify="flex-start">
        <Grid item xs={12}>
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
                  <TableCell>
                    "{selectedSong.song_name}"
                  </TableCell>
                  <TableCell>
                    {selectedSong.artist_name}
                  </TableCell>
                  <TableCell>
                    {selectedSong.album_name}
                  </TableCell>
                  <TableCell className={styles.buttonCell}>
                    <Button size="small"
                            variant="contained"
                            color="primary">
                      Show Similar
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      className={styles.checkbox}
                      color="default"
                      checked={checked}
                      onChange={this.handleCheckboxChange}
                      checkedIcon={<span className={clsx(styles.icon, styles.checkedIcon)} />}
                      icon={<span className={styles.icon} />}
                      inputProps={{ 'aria-label': 'decorative checkbox' }}
                    />
                    Match Genre
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
            <Table>
              <TableBody>
                {songAttributes.map((attribute, i) => {
                  return (
                    <Parameter styles={styles}
                               attribute={attribute}
                               i={i}
                               key={i}
                               initialValues={initialValues}
                               values={values}
                               setValues={this.setParameterValues}/>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

        </Grid>
      </Grid> 
    )
  }
}
Recommendations.propTypes = {

}

export default RecommendationWrapper
