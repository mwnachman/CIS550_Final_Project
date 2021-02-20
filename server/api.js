const config = require('../config/server.json')
const axios = require('axios')

const APIRoot = config.setlistFM.API_ROOT
const API_KEY = config.setlistFM.API_KEY

// *** placeholder for DB connection ***
// const mysql = require('mysql');
// const config = config.db-config
// config.connectionLimit = 10;
// const connection = mysql.createPool(config);


// ROUTE HANDLERS

async function getSetlists(req, res) {
  try {
    const promise = await axios({
      method: 'GET',
      url: `${APIRoot}/artist/${req.params.artist_id}/setlists`,
      headers: {
        'x-api-key': API_KEY,
        'accept': 'application/json'
      }
    })
    if (promise.status == 200) {
      res.json(promise.data)
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  getSetlists
}
