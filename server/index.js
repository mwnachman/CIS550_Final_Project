/* global process:false */
const bodyParser = require('body-parser')
const express = require('express')
const api = require('./api')
const cors = require('cors')
const config = require('../config/server.json')


const app = express()

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']


app.use(cors({credentials: true, origin: {APIRoot}}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.get('/setlists/:artist_id', api.getSetlists)


app.listen(3000, () => {
  console.log('Server listening on PORT 3000');
});
