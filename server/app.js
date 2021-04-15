const serverless = require('serverless-http');
const express = require('express');
var routes = require("./routes.js");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -- PROJECT QUERIES -- */

app.get('/top5', routes.top5);
app.get('/popularByGenre/:years', routes.popularByGenre);
app.get('/searchSong/:song', routes.searchSong);
app.get('/searchArtist/:artist', routes.searchArtist);
app.get('/searchAlbum/:album', routes.searchArtist);
app.get('/searchArtistTop10/:artist', routes.searchArtistTop10);
app.get('/searchAlbumAllSongs/:album', routes.searchAlbumAllSongs);
app.get('/recommendSongs/:input', routes.recommendSongs);


// comment out line below for lambda deployment
//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
