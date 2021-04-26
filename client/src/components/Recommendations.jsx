/* global process:false */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
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
      values: [0,0,0,0,0,0,0,0],
      initialValues: [0,0,0,0,0,0,0,0]
    }
    this.getSongDetails = this.getSongDetails.bind(this)
    this.setParameterValues = this.setParameterValues.bind(this)
  }

  componentDidMount() {
    const {selectedSong} = this.props
    if (selectedSong) {
      this.getSongDetails(selectedSong.songId)
    }
  }

  setParameterValues(values) {
    this.setState({values})
  }

  submit(e) {
    e.preventDefault()
  }

  async getSongDetails(id) {
    const promise = await axios.get(`${APIRoot}/songDetails/${id}`)
    const status = promise.status
    if (status == 200) {
      const songDetails = promise.data[0]
      let initialValues = songAttributes.map(attribute => songDetails[attribute['dbName']])
      this.setState({
                    songDetails,
                    initialValues,
                    values: initialValues
                   })
    }
  }  

  render() {
    const {selectedSong, styles} = this.props
    const {values, initialValues} = this.state
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
                    "{selectedSong.Song}"
                  </TableCell>
                  <TableCell>
                    {selectedSong.Artist}
                  </TableCell>
                  <TableCell>
                    {selectedSong.Album}
                  </TableCell>
                  <TableCell>
                    <Button size="small"
                            variant="contained"
                            color="primary">
                      Show Similar
                    </Button>
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
