import React from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'

import Browse from './Browse.jsx'
import Home from './Home.jsx'
import Recommendations from './Recommendations.jsx'
import Search from './Search.jsx'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


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
    this.changeTab = this.changeTab.bind(this)
    this.state = {
      value: 2
    }
  }

  handleChange(event, newValue) {
    event.preventDefault();
    this.setState({value: newValue})
  }

  changeTab(newValue) {
    this.setState({value: newValue})
  }

  render() {
    const { value } = this.state
    const { setlist } = this.props
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
          <Home changeTab={this.changeTab}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Browse setlist={setlist}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Search/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Recommendations/>
        </TabPanel>
      </div>
    )
  }
}
TabComponent.propTypes = {
  setlist: PropTypes.array
}

export default TabComponent
