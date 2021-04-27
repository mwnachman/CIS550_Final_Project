/* global process:false */
const cors = require('cors')
const serverless = require('serverless-http');
const express = require('express');
var routes = require('./api.js');
const config = require('./config/server-template.json')
const app = express();

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

app.use(cors({credentials: true, origin: {APIRoot}}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -- PROJECT QUERIES -- */

app.get('/getGenre/:genreId', routes.getGenre);
app.get('/top5', routes.top5);
app.get('/traitByGenre/:genreId/:trait', routes.traitByGenre);
app.get('/songDetails/:songId', routes.getSongDetails);
app.get('/searchSong/:song', routes.searchSong);
app.get('/searchArtist/:artist', routes.searchArtist);
app.get('/searchAlbum/:album', routes.searchAlbum);
app.get('/searchArtistTop10/:artist', routes.searchArtistTop10);
app.get('/searchAlbumAllSongs/:album', routes.searchAlbumAllSongs);
app.get('/recommendSongs/:input', routes.recommendSongs);


// comment out line below for lambda deployment
app.listen(3000, () => console.log(`Listening on: 3000`));
// module.exports.handler = serverless(app);
