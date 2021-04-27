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
	t1.name AS song_name
	, t1.id AS song_id
	, t3.name AS artist_name
	, t2.artist_id
	, t2.title AS album_name
	, t2.id AS album_id
	, t2.release_year AS album_release_year
	, t2.format AS album_format
	, t4.name AS record_label_name
FROM 
	RecordLabel t4
    JOIN Album t2 ON t2.record_label_id = t4.id
    JOIN Artist t3 ON t2.artist_id = t3.id 
    JOIN Song t1 ON t1.album_id = t2.id
WHERE t2.genre_id = `+req.params.genreId+`
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
  SELECT
	t2.title AS album_name
	, t2.id AS album_id
	, t3.name AS artist_name
	, t2.artist_id
	, t2.release_year AS album_release_year
	, t2.format AS album_format
	, t4.name AS record_label_name
	, t2.aoty_critic_score*.1 AS album_critic_score
	, t2.aoty_user_score*.1 AS aoty_user_score
FROM
	RecordLabel t4 
	JOIN Album t2 ON t2.record_label_id = t4.id
	JOIN Artist t3 ON t2.artist_id = t3.id 
WHERE t2.genre_id = `+req.params.genreId+` AND t2.num_aoty_user_reviews >= 15
ORDER BY t2.aoty_user_score DESC
LIMIT 50;
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

/*-- q2: Most "Trait" By Genre --*/
async function traitByGenre(req, res) {
  const query = `
  SELECT 
	t2.title AS album_name
	, t2.id AS album_id
	, t3.name AS artist_name
	, t2.artist_id AS artist_id
	, t2.release_year AS album_release_year
	, t2.format AS album_format
	, t4.name AS record_label_name
	, t2.aoty_critic_score*.1 AS album_critic_score
	, t2.aoty_user_score*.1 AS album_user_score
	, AVG(t1.`+req.params.trait+`) AS avg_danceability
FROM (
	SELECT 
		release_year
		, title 
		, id
		, format
		, aoty_critic_score
		, aoty_user_score
        	, record_label_id
       		, artist_id
	FROM Album 
	WHERE genre_id = `+req.params.genreId+`
)t2
	JOIN RecordLabel t4 ON t2.record_label_id = t4.id
	JOIN Artist t3 ON t2.artist_id = t3.id
	JOIN Song t1 ON t1.album_id = t2.id
GROUP BY album_id
ORDER BY avg_danceability DESC
LIMIT 50;
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
  SELECT
	t1.name AS song_name
	, t1.id AS song_id
	, t2.title AS album_name
	, t3.name AS artist_name
  , t3.id AS artist_id
	, t2.release_year AS album_release_year
FROM (
	SELECT
		album_id
		, name
		, id 
	FROM Song
	WHERE Song.name LIKE '%`+req.params.song+`%'
		OR SOUNDEX(Song.name) = SOUNDEX('`+req.params.song+`')
) t1 
    JOIN Album t2 ON t1.album_id = t2.id
    JOIN Artist t3 ON t2.artist_id = t3.id
ORDER BY 
	(song_name = '`+req.params.song+`') DESC 
	, (song_name LIKE '`+req.params.song+` %') 
		OR (song_name LIKE '% `+req.params.song+`') 
		OR (song_name LIKE '% `+req.params.song+` %') DESC
	, (song_name LIKE '%`+req.params.song+`%') DESC
	, length(song_name);
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
  WITH similar_artists  AS (
    SELECT 
      artist_name
      , artist_id
      , COUNT(DISTINCT album_name) AS album_count
      , COUNT(DISTINCT song_name) AS song_count
    FROM (
      SELECT 
        t3.name AS artist_name
        , t3.id AS artist_id
        , t2.title AS album_name
        , t1.name AS song_name
      FROM (
        SELECT id, name
              FROM Artist
              WHERE name LIKE '%`+req.params.artist+`%' 
      OR SOUNDEX(name) = SOUNDEX('`+req.params.artist+`')
          ) t3
          JOIN Album t2 ON t2.artist_id = t3.id
          JOIN Song t1 ON t1.album_id = t2.id
    ) x
    GROUP BY artist_name
  )
  SELECT 
    similar_artists.artist_name
    , similar_artists.artist_id
    , similar_artists.album_count
    , similar_artists.song_count
    , t5.name AS most_frequent_genre_name
  FROM similar_artists 
    JOIN (
      SELECT
        artist_id
        , genre_id
      FROM (
        SELECT  
          artist_id
          , genre_id
          , genre_count
          , ROW_NUMBER() OVER (PARTITION BY artist_id ORDER BY genre_count DESC) AS score_rank
        FROM (
          SELECT 
            artist_id
            , genre_id
            , COUNT(*) AS genre_count
          FROM (
            SELECT
              t2.artist_id AS artist_id
              , t2.genre_id AS genre_id
            FROM Album t2
                              WHERE t2.artist_id IN (
              SELECT artist_id
              FROM similar_artists
            ) 
          ) x
          GROUP BY artist_id, genre_id
          ORDER BY artist_id
        ) y
      ) z
      WHERE score_rank < 2
    ) most_frequent_genre ON similar_artists.artist_id = most_frequent_genre.artist_id
    JOIN Genre t5 ON most_frequent_genre.genre_id = t5.id
  ORDER BY 
    (artist_name LIKE '`+req.params.artist+`') DESC 
    , (artist_name LIKE '`+req.params.artist+` %') DESC 
    , (artist_name LIKE '% `+req.params.artist+`') DESC
    , (artist_name LIKE '%`+req.params.artist+`%') DESC
    , album_count DESC 
    , song_count DESC;
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
  SELECT
	t2.title AS album_name
	, t2.id AS album_id
	, t3.name AS artist_name
	, t2.release_year AS album_release_year
	, t2.format AS album_format
	, t4.name AS record_label_name
FROM (
	SELECT 
	title
        , id
        , release_year
        , format
        , record_label_id
        , artist_id
    FROM Album 
    WHERE title LIKE '%`+req.params.album+`%'
	OR SOUNDEX(title) = SOUNDEX('`+req.params.album+`')
)t2
	JOIN RecordLabel t4 ON t2.record_label_id = t4.id
	JOIN Artist t3 ON t2.artist_id = t3.id
ORDER BY 
	(album_name = '`+req.params.album+`') DESC 
	, (album_name LIKE '`+req.params.album+` %') 
		OR (album_name LIKE '% `+req.params.album+`') 
		OR (album_name LIKE '% `+req.params.album+` %') DESC
	, (album_name LIKE '%`+req.params.album+`%')  DESC
	, length(album_name);
  `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}


/*-- q6: Search an artist and display all albums by AOTY User Score. This will be used for the Artist display page. --*/
async function searchArtistAlbums(req, res) {
  const query = `
  SELECT
  t1.name AS artist_name
  , t2.id AS album_id
  , t2.title AS album_name
  , t2.format AS album_format
  , t2.release_year AS release_year
  , t2.aoty_critic_score AS aoty_critic_score
  , t2.aoty_user_score AS aoty_user_score
  , t2.num_aoty_critic_reviews AS num_aoty_critic_reviews
  , t2.num_aoty_user_reviews AS num_aoty_user_reviews
  , t3.name AS record_label_name
  , t4.name AS genre_name
FROM (
  SELECT name, id
  FROM Artist
  WHERE id = '`+req.params.artist_id+`'
) t1
  JOIN Album t2 ON t2.artist_id = t1.id
  JOIN Genre t4 ON t2.genre_id = t4.id
  JOIN RecordLabel t3 ON  t2.record_label_id = t3.id
ORDER BY t2.aoty_user_score DESC
LIMIT 50;
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
  traitByGenre,
  searchSong,
  searchArtist,
  searchAlbum,
  searchArtistAlbums,
  searchAlbumAllSongs,
  recommendSongs
}