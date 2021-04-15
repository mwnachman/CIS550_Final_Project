const serverless = require('serverless-http');
const express = require('express');
var routes = require("./routes.js");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// testing to make sure we get a response
app.get('/genres', (req, res) => {
  res.send({
    genres: ['electronic', 'reggae', 'dance']
  })
});

// trying an endpoint that queries the db
app.get('/artistTest', routes.artistTest);

/* -- PROJECT QUERIES -- */

app.get('/top5', routes.top5);
app.get('/popularByGenre/:years', routes.popularByGenre);

//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);