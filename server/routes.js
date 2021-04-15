const mysql = require('mysql');
const con = mysql.createConnection({
  host: "",
  port: "",
  user: "",
  password: "",
  database: ""
});

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/*-- q1: Get the top 5 popular albums from each year or genre ranked by AOTY User Score.  This will be used for the Landing/ Browsing by Popularity tab --*/
function top5(req, res) {
  var query = `
  SELECT *
  FROM (
    SELECT t1.release_year, t2.name AS genre, t1.title AS album, ROW_NUMBER() OVER (PARTITION BY t1.release_year ORDER BY t1.aoty_user_score DESC) AS score_rank
    FROM Album t1 JOIN Genre t2 ON t1.genre_id = t2.id) x
  WHERE score_rank <= 5;
  `;
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/*-- q2: Get the most popular album from each genre within a range of years (user input). This will be used for the Landing/ Browsing by Popularity tab. --*/
function popularByGenre(req, res) {
  var dateRange = (req.params.years).split("-");
  var query = `
  SELECT *
  FROM
    (SELECT t1.release_year, t2.name AS genre, t1.title AS album, ROW_NUMBER() OVER (PARTITION BY t2.name ORDER BY t1.aoty_user_score DESC) AS score_rank
    FROM Album t1 JOIN Genre t2 ON t1.genre_id = t2.id) x
  WHERE release_year BETWEEN '`+dateRange[0]+`' AND '`+dateRange[1]+`' AND score_rank = 1;
  `;
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/*-- q3: Search a song by keyword. Include information for the Song’s Album and Artist. This will be used in our Search tab. --*/
function searchSong(req, res) {
  var query = `
  SELECT t1.name AS Song, t2.title AS Album, t3.name AS Artist
  FROM Song t1
  LEFT JOIN Album t2 ON t1.album_id = t2.id
  LEFT JOIN Artist t3 ON t2.artist_id = t3.id
  WHERE t1.name LIKE '`+req.params.song+`';
  `;
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/*-- q4: Search for an artist by keyword. Include the number of songs and albums they have. This will be used in our Search tab. --*/
function searchArtist(req, res) {
  var query = `
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
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/*-- q5: Search for an album by keyword. Include the Artist, Record Label, and Format. This will be used in our Search tab. --*/
function searchAlbum(req, res) {
  var query = `
  SELECT t1.title AS Album, t2.name AS Artist, t1.format AS Format, t3.name AS Record_Label
  FROM Album t1
  LEFT JOIN Artist t2 ON t1.artist_id = t2.id
  LEFT JOIN RecordLabel t3 ON t1.record_label_id = t3.id
  WHERE t1.title LIKE '`+req.params.album+`';
  `;
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


/*-- q6: Search an artist and display top 10 most popular albums by AOTY User Score. This will be used for the Artist display page. --*/
function searchArtistTop10(req, res) {
  var query = `
  SELECT t1.name AS Artist, t2.title AS Album, t2.release_year AS Year, t3.name AS Genre, t2.aoty_critic_score AS AOTY_Critic_Score, t2.aoty_user_score AS AOTY_User_Score
  FROM Artist t1
  LEFT JOIN Album t2 ON t1.id = t2.artist_id
  LEFT JOIN Genre t3 ON t2.genre_id = t3.id
  WHERE t1.name LIKE '`+req.params.artist+`'
  ORDER BY t2.aoty_user_score DESC
  LIMIT 10;
  `;
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/*-- q7:  --*/
function searchAlbumAllSongs(req, res) {
  var query = `
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
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/*-- q8: Identify songs with most similar attributes of the input attributes. This will be used in our Recommender tab. --*/
function recommendSongs(req, res) {
  let release_year, danceability, energy, loudness, acousticness, speechiness, instrumentalness, liveness, tempo, genre;
  [release_year, danceability, energy, loudness, acousticness, speechiness, instrumentalness, liveness, tempo, genre] = (req.params.input).split("-");
  var query = `
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
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

module.exports = {
  top5: top5,
  popularByGenre: popularByGenre,
  searchSong: searchSong,
  searchArtist: searchArtist,
  searchAlbum: searchAlbum,
  searchArtistTop10: searchArtistTop10,
  searchAlbumAllSongs: searchAlbumAllSongs,
  recommendSongs: recommendSongs
}
