const config = require('../config/server.json')
const axios = require('axios')
const mysql = require('mysql2');

aws_config = config['aws-mysql']
aws_config.connectionLimit = 10;
aws_config.waitForConnections = true;
const connection = mysql.createPool(aws_config);

const setlist_APIRoot = config.setlistFM.API_ROOT
const setlist_API_KEY = config.setlistFM.API_KEY




// ROUTE HANDLERS

async function getAllAlbums(req, res) {
  console.log('in get albums')
  let query = `
    SELECT *
    FROM Album;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

async function getSetlists(req, res) {
  try {
    const promise = await axios({
      method: 'GET',
      url: `${setlist_APIRoot}/artist/${req.params.artist_id}/setlists`,
      headers: {
        'x-api-key': setlist_API_KEY,
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
  getAllAlbums,
  getSetlists
}

