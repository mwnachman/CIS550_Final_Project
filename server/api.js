const config = require('./config/server.json')
const mysql = require('mysql')

const aws_config = config['aws-mysql']
aws_config.connectionLimit = 10
aws_config.waitForConnections = true
const con = mysql.createPool(aws_config)


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/*-- q0: Randomly generate 5 song/album/artist entries in a selected genre for homepage --*/
function getGenre(req, res) {
  var query = `
  SELECT
    t1.name AS song_name,
    t1.id AS song_id,
    t3.name AS artist_name,
    t2.artist_id,
    t2.title AS album_name,
    t2.id AS album_id,
    t2.release_year AS album_release_year,
    t2.format AS album_format,
    t4.name AS record_label_name
  FROM
    Song t1
    LEFT JOIN Album t2 ON t1.album_id = t2.id
    LEFT JOIN Artist t3 ON t2.artist_id = t3.id
    LEFT JOIN RecordLabel t4 ON t2.record_label_id = t4.id
    LEFT JOIN Genre t5 ON t2.genre_id = t5.id
  WHERE genre_id = `+req.params.genreId+`
  ORDER BY RAND()
  LIMIT 5;
  `;
  con.query(query, function(err, rows, fields) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

async function getAllAlbums(req, res) {
  let query = `
    SELECT *
    FROM Album;
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

/*-- q1: Get the top 5 popular albums from each year or genre ranked by AOTY User Score.  This will be used for the Landing/ Browsing by Popularity tab --*/
async function top5(req, res) {
  const query = `
  SELECT *
  FROM (
    SELECT t1.release_year, t2.name AS genre, t1.title AS album, ROW_NUMBER() OVER (PARTITION BY t1.release_year ORDER BY t1.aoty_user_score DESC) AS score_rank
    FROM Album t1 JOIN Genre t2 ON t1.genre_id = t2.id) x
  WHERE score_rank <= 5;
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

/*-- q2: Get the most popular album from each genre within a range of years (user input). This will be used for the Landing/ Browsing by Popularity tab. --*/
async function popularByGenre(req, res) {
  const dateRange = (req.params.years).split("-");
  const query = `
  SELECT *
  FROM
    (SELECT t1.release_year, t2.name AS genre, t1.title AS album, ROW_NUMBER() OVER (PARTITION BY t2.name ORDER BY t1.aoty_user_score DESC) AS score_rank
    FROM Album t1 JOIN Genre t2 ON t1.genre_id = t2.id) x
  WHERE release_year BETWEEN '`+dateRange[0]+`' AND '`+dateRange[1]+`' AND score_rank = 1;
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

/*-- q3: Search a song by keyword. Include information for the Song’s Album and Artist. This will be used in our Search tab. --*/
async function searchSong(req, res) {
  const query = `
  SELECT t1.name AS Song, t1.id as songId, t2.title AS Album, t3.name AS Artist, t2.release_year AS release_year
  FROM Song t1
  LEFT JOIN Album t2 ON t1.album_id = t2.id
  LEFT JOIN Artist t3 ON t2.artist_id = t3.id
  WHERE t1.name LIKE '`+req.params.song+`';
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

async function getSongDetails(req, res) {
  const query = `
    SELECT *
    FROM Song
    WHERE id = '`+req.params.songId+`'
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

/*-- q4: Search for an artist by keyword. Include the number of songs and albums they have. This will be used in our Search tab. --*/
async function searchArtist(req, res) {
  const query = `
  SELECT Artist, COUNT(DISTINCT Album) AS Album_count, COUNT(DISTINCT Song) AS Song_count
  FROM (
    SELECT t3.name AS Artist, t2.title AS Album, t1.name AS Song
    FROM Song t1
    LEFT JOIN Album t2 ON t1.album_id = t2.id
    LEFT JOIN Artist t3 ON t2.artist_id = t3.id
    WHERE t3.name LIKE '`+req.params.artist+`'
    ) x
  GROUP BY Artist;
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

/*-- q5: Search for an album by keyword. Include the Artist, Record Label, and Format. This will be used in our Search tab. --*/
async function searchAlbum(req, res) {
  const query = `
  SELECT t1.title AS Album, t2.name AS Artist, t1.format AS Format, t3.name AS Record_Label
  FROM Album t1
  LEFT JOIN Artist t2 ON t1.artist_id = t2.id
  LEFT JOIN RecordLabel t3 ON t1.record_label_id = t3.id
  WHERE t1.title LIKE '`+req.params.album+`';
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}


/*-- q6: Search an artist and display top 10 most popular albums by AOTY User Score. This will be used for the Artist display page. --*/
async function searchArtistTop10(req, res) {
  const query = `
    SELECT t1.name AS Artist, t2.title AS Album, t2.release_year AS Year, t3.name AS Genre, t2.aoty_critic_score AS AOTY_Critic_Score, t2.aoty_user_score AS AOTY_User_Score
    FROM Artist t1
    LEFT JOIN Album t2 ON t1.id = t2.artist_id
    LEFT JOIN Genre t3 ON t2.genre_id = t3.id
    WHERE t1.name LIKE '`+req.params.artist+`'
    ORDER BY t2.aoty_user_score DESC
    LIMIT 10;
    `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

/*-- q7:  --*/
async function searchAlbumAllSongs(req, res) {
  const query = `
  SELECT
    track_number as Track_Number, 
    FLOOR(duration_ms/60000) AS time_minutes,
    ROUND((duration_ms/60000 % 1)*60) AS time_seconds,
    name AS Name,
    danceability as Danceability,
    energy as Energy,
    loudness as Loudness,
    acousticness as Acousticness,
    speechiness as Speechiness,
    instrumentalness as Instrumentalness,
    liveness as Liveness,
    tempo as Tempo,
    explicit as Explicit
  FROM Song
  WHERE album_id IN (
    SELECT id
    FROM Album
    WHERE title = '`+req.params.album+`'
  )
  ORDER BY track_number;
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

/*-- q8: Identify songs with most similar attributes of the input attributes. This will be used in our Recommender tab. --*/
async function recommendSongs(req, res) {
  let release_year, danceability, energy, loudness, acousticness, speechiness, instrumentalness, liveness, tempo, genre;
  [release_year, danceability, energy, loudness, acousticness, speechiness, instrumentalness, liveness, tempo, genre] = (req.params.input).split("-");
  const query = `
  SELECT
    t1.id AS song_id,
    t1.name AS song_name,
    POWER( '`+release_year+`' - t2.release_year, 2)*.01
      + ABS( '`+danceability+`' - t1.danceability)*20
      + ABS( '`+energy+`' - t1.energy)*10
      + ABS( '`+loudness+`' - t1.loudness)*.5
      + ABS( '`+acousticness+`' - t1.acousticness)*10
      + SQRT (ABS( '`+speechiness+`' - t1.speechiness))*10
      + ABS( '`+instrumentalness+`' - t1.instrumentalness)*10
      + ABS( '`+liveness+`' - t1.liveness )*50
      + ABS( '`+tempo+`' - t1.tempo)*.05 AS score
  FROM Song t1 LEFT JOIN Album t2 ON t1.album_id = t2.id
  WHERE t2.genre_id = '`+genre+`'
  ORDER BY score ASC
  LIMIT 50;
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

module.exports = {
  getGenre,
  getAllAlbums,
  top5,
  getSongDetails,
  popularByGenre,
  searchSong,
  searchArtist,
  searchAlbum,
  searchArtistTop10,
  searchAlbumAllSongs,
  recommendSongs
}
