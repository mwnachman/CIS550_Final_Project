/* global process:false */
const cors = require('cors')
const serverless = require('serverless-http');
const express = require('express');
var routes = require('./api.js');
const config = require('./config/server.json')
const app = express();

const APIRoot = config.BASE_URL[process.env.NODE_ENV || 'development']

app.use(cors({credentials: true, origin: {APIRoot}}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -- PROJECT QUERIES -- */

app.get('/getGenre/:genreId', routes.getGenre);
app.get('/top5/:genreId', routes.top5);
app.get('/traitByGenre/:genreId/:trait', routes.traitByGenre);
app.get('/songDetails/:songId', routes.getSongDetails);
app.get('/searchSong/:song', routes.searchSong);
app.get('/searchSong/:song/play', routes.getSongUrl);
app.get('/searchArtist/:artist', routes.searchArtist);
app.get('/searchAlbum/:album', routes.searchAlbum);
app.get('/searchAlbum/:album/art', routes.getAlbumArt)
app.get('/searchArtistAlbums/:artist_id', routes.searchArtistAlbums);
app.get('/searchAlbumAllSongs/:album', routes.searchAlbumAllSongs);
app.get('/recommendSongs', routes.recommendSongs);
app.get('/recommendAlbums', routes.recommendAlbums);
app.get('/recommendArtists', routes.recommendArtists);


 






// comment out line below for lambda deployment
app.listen(3000, () => console.log(`Listening on: 3000`));
// module.exports.handler = serverless(app);
