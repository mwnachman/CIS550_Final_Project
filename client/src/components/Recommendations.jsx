/* global process:false */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  FormControlLabel,
  Grid,
  InputBase,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import {
  Headers,
  NoResult,
  Search,
  SearchResult} from './Search.jsx'
import useStyles from '../style/recommendations'
import * as config from '../../config/client.json'

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

const columns = [
  {
    header: 'Song',
    label: 'Song',
    minWidth: '30vh'
  },
  {
    header: 'Artist',
    label: 'Artist',
    minWidth: '30vh'
  },
  {
    header: 'Album',
    label: 'Album',
    minWidth: '30vh'
  },
  {
    header: 'Action',
    minWidth: '10vh'
  }
]

export const GetRecs = () => (
  <div>
    recommendations
  </div>
)

const RecommendationWrapper = props => {
  const styles = useStyles()
  return <Recommendations styles={styles} {...props} />
}

class Recommendations extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searched: false,
      searchTerm: '',
      searchResults: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.searchSongs = this.searchSongs.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    if (this.props.song) {
      console.log('SONG PROVIDED')
    }
  }

  handleChange({target: {value}}) {
    this.setState({searchTerm: value})
  }

  submit(e) {
    e.preventDefault()
    this.searchSongs()
    this.setState({searched: true})
  }

  async searchSongs() {
    this.setState({resultType: 'song'})
    const promise = await axios.get(`${APIRoot}/searchSong/${this.state.searchTerm}`)
    const status = promise.status
    if (status == 200) {
      const songs = promise.data
      this.setState({
        searchResults: songs,
        searchTerm: ""
      })
    }
  }

  render() {
    const { styles } = this.props
    const { searched,
            searchTerm,
            searchResults } = this.state
    return (
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        className={styles.exterior_grid}>

        <Grid item xs={12} className={styles.interior_grid}>
          
          <Card className={styles.root}>
            <CardActionArea>
              <CardMedia
                className={styles.media}
                image="/assets/recommendations.jpg"
              />

              <CardContent>

                <Grid container
                      direction="column"
                      alignItems="flex-start"
                      justify="flex-start">
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Get music recommendations based on songs you like...
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={6} >
                  <form onSubmit={this.submit}>
                    <FormControl className={styles.form}>
                      <Search styles={styles}
                              handleChange={this.handleChange}
                              searchTerm={searchTerm}/>
                    </FormControl>
                  </form>
                </Grid>

                <Grid container
                      direction="row"
                      alignItems="flex-start"
                      justify="flex-start">
                  <Grid item xs={12}>

                    <TableContainer className={styles.container}>
                      <Table aria-label="sticky table">

                        <TableHead>
                          {searched && <Headers styles={styles.header} columns={columns}/>}
                        </TableHead>

                        <TableBody>
                          {searchResults.map((result, i) => (
                            <SearchResult result={result}
                                          headers={columns}
                                          key={i}/>
                          ))}
                          {searched && !searchResults.length && (
                            <NoResult/>
                          )}
                        </TableBody>

                      </Table>
                    </TableContainer>

                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid> 
    )
  }
}
Recommendations.propTypes = {

}

export default RecommendationWrapper
