import React from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  Paper,
  Tab,
  TabPanel,
  Tabs
} from '@material-ui/core'

import Browse from './Browse.jsx'
import Home from './Home.jsx'
import Recommendations from './Recommendations.jsx'
import Search from './Search.jsx'


function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  }
}

class TabComponent extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: 0
    }
  }

  handleChange(event, newValue) {
    event.preventDefault();
    this.setState({value: newValue})
  }

  render() {
    const { value } = this.state
    return (
      <div>
        <AppBar position="static">
          <Paper square>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleChange}
            >
              <Tab label="Home" {...a11yProps(0)}/>
              <Tab label="Browse" {...a11yProps(1)}/>
              <Tab label="Search" {...a11yProps(2)}/>
              <Tab label="Recommendations" {...a11yProps(3)}/>
            </Tabs>
          </Paper>
        </AppBar>
        <TabPanel value={value} index={0}>
        hi
        </TabPanel>
      </div>
    )
  }
}
TabComponent.propTypes = {}

export default TabComponent
