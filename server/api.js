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
    SELECT s.*, a.genre_id, a.release_year
    FROM Song s JOIN Album a ON s.album_id = a.id
    WHERE s.id = '`+req.params.songId+`'
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
  , t3.id AS artist_id
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
    JOIN RecordLabel t3 ON t2.record_label_id = t3.id
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



/*-- q6B: Search an artist and display summary stats (show as 0-10) for all of their songs. This will be used for the Artist display page. --*/
async function searchArtistStats(req, res) {
  const query = `
	SELECT
		AVG(t1.danceability)*10 AS avg_danceability
		, AVG(t1.energy)*10 AS avg_energy
		, AVG(t1.acousticness)*10 AS avg_acousticness
		, AVG(t1.speechiness)*10 AS avg_speechiness
		, AVG(t1.instrumentalness)*10 AS avg_instrumentalness
		, AVG(t1.liveness)*10 AS avg_liveness
		, AVG(t1.valence)*10 AS avg_valence
		, AVG(t1.loudness) AS avg_loudness_db
		, AVG(t1.tempo) AS avg_tempo_bpm
		, AVG(t1.duration_ms) AS avg_duration_ms
		, AVG(t2.aoty_critic_score)*.1 AS avg_album_critic_score
		, AVG(t2.aoty_user_score)*.1 AS avg_album_user_score
		, MAX(t1.track_number) AS most_tracks_in_album
		, MAX(t2.release_year) AS most_recent_release_year
	FROM ( 
		SELECT name, id
		FROM Artist
		WHERE id = `+req.params.album+`
	) t3 
		JOIN Album t2 ON t2.artist_id = t3.id
		JOIN Song t1 ON t1.album_id = t2.id;
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


/*-- q7B: Search an album and dislay album information and summary stats for all of the songs in the album. This will be used for the Album display page. --*/
async function searchAlbumStats(req, res) {
  const query = `
	SELECT
		t2.title AS album_name
		, t2.id AS album_id
		, t3.name AS artist_name
		, t3.id AS artist_id
		, t2.release_year AS album_release_year
		, t2.format AS album_format
		, t4.name AS record_label_name
		, t5.name AS genre_name
		, t2.aoty_critic_score*.1 AS album_critic_score
		, t2.aoty_user_score*.1 AS album_user_score
		, t2.num_aoty_critic_reviews AS num_aoty_critic_reviews
		, t2.num_aoty_user_reviews AS num_aoty_user_reviews
		, AVG(t1.danceability)*10 AS avg_danceability
		, AVG(t1.energy)*10 AS avg_energy
		, AVG(t1.acousticness)*10 AS avg_acousticness
		, AVG(t1.speechiness)*10 AS avg_speechiness
		, AVG(t1.instrumentalness)*10 AS avg_instrumentalness
		, AVG(t1.liveness)*10 AS avg_liveness
		, AVG(t1.valence)*10 AS avg_valence
		, AVG(t1.loudness) AS avg_loudness_db
		, AVG(t1.tempo) AS avg_tempo_bpm
		, AVG(t1.duration_ms) AS avg_duration_ms
	FROM  (
		SELECT 
			*
		FROM Album
		WHERE id = `+req.params.album+`
	) t2 
		JOIN Genre t5 ON t2.genre_id = t5.id
		JOIN RecordLabel t4 ON t2.record_label_id = t4.id
		JOIN Artist t3 ON t2.artist_id = t3.id
		JOIN Song t1 ON t1.album_id = t2.id;
    `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}


/*-- q8: Search a song and display statistics and relevant information. This will be used for the Song display page. --*/
async function searchSongStats(req, res) {
  const query = `
	SELECT 
		t1.name AS song_name
		, t1.duration_ms AS duration_ms
		, t1.danceability*10  AS danceability
		, t1.energy*10  AS energy
		, t1.song_key AS song_key
		, t1.loudness AS loudness_db
		, t1.acousticness*10  AS acousticness
		, t1.speechiness*10  AS speechiness
		, t1.instrumentalness*10  AS instrumentalness
		, t1.liveness*10  AS liveness
		, t1.valence*10  AS valence
		, t1.tempo AS tempo_bpm
		, t1.mode AS major_minor_mode
		, t1.time_signature AS time_signature
		, t1.disc_number AS disc_number
		, t1.track_number AS track_number
		, t2.title AS album_name
		, t2.id AS album_id
		, t3.name AS artist_name
		, t3.id AS artist_id
		, t2.release_year AS album_release_year
		, t2.format AS album_format
		, t4.name AS record_label_name
		, t5.name AS genre_name
		, t2.aoty_critic_score*.1 AS album_critic_score
		, t2.aoty_user_score*.1 AS album_user_score
		, t2.num_aoty_critic_reviews AS album_num_critic_reviews
		, t2.num_aoty_user_reviews AS album_num_user_reviews
	FROM  (
		SELECT *
		FROM Song
		WHERE id = `+req.params.song+`
	) t1
		JOIN Album t2 ON t1.album_id = t2.id
		JOIN Genre t5 ON t2.genre_id = t5.id
		JOIN  RecordLabel t4 ON t2.record_label_id = t4.id
		JOIN Artist t3 ON t2.artist_id = t3.id;
    `;
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}



/*-- q9: Identify songs with most similar attributes of the input attributes. This will be used in our Recommender tab. --*/
async function recommendSongs(req, res) {
  // Holland, I need this query to return only values where
  // s.id <> ${songId}
  // and I need genre added (to check both the value
  // of req.query.include.genre and to look up the genre to match)
  let incl = JSON.parse(req.query.include)
  let vals = JSON.parse(req.query.sliderValues)
  let song = JSON.parse(req.query.songInfo)
  console.log('inlc ', incl)
  console.log('vals ', vals)
  let songId = song.song_id
  let release_year = incl.release_year ? vals.release_year : -1
  let danceability = incl.danceability ? vals.danceability : -1
  let loudness = incl.loudness ? vals.loudness : -1
  let energy = incl.energy ? vals.energy : -1
  let acousticness = incl.acousticness ? vals.acousticness : -1
  let speechiness = incl.speechiness ? vals.speechiness : -1
  let instrumentalness = incl.instrumentalness ? vals.instrumentalness : -1
  let liveness = incl.liveness ? vals.liveness : -1
  let tempo = incl.tempo ? vals.tempo : -100
  console.log(release_year, danceability, loudness, energy, acousticness, speechiness, instrumentalness, liveness, tempo)
  const query = `
    SELECT 
      s.name AS song_name
      , s.id AS song_id
      , ar.name AS artist_name
      , ar.id AS artist_id
      , al.title AS album_name
      , al.id AS album_id
    FROM 
      Album al JOIN Artist ar ON al.artist_id = ar.id JOIN Song s ON s.album_id = al.id
    WHERE 1=1
      AND
        (CASE WHEN ${release_year} <> -1 THEN al.release_year = ${release_year}
        ELSE al.release_year BETWEEN 1940 AND 2020
        END)
      AND 
        (CASE WHEN ${danceability} <> -1 THEN s.danceability BETWEEN (${danceability} - 0.1) AND (${danceability} + 0.1)
        ELSE s.danceability BETWEEN 0 AND 1
        END)
      AND 
        (CASE WHEN ${energy} <> -1 THEN s.energy BETWEEN (${energy} - 0.1) AND (${energy} + 0.1)
        ELSE s.energy BETWEEN 0 AND 1
        END)
      AND 
        (CASE WHEN ${loudness} <> -100 THEN s.loudness BETWEEN (${loudness} - 5) AND (${loudness} + 5)
        ELSE s.loudness BETWEEN -60 AND 6
        END)
      AND 
        (CASE WHEN ${acousticness} <> -1 THEN s.acousticness BETWEEN (${acousticness} - 0.15) AND (${acousticness} + 0.15)
        ELSE s.acousticness BETWEEN 0 AND 1
        END)
      AND 
        (CASE WHEN ${speechiness} <> -1 THEN s.speechiness BETWEEN (${speechiness} - 0.2) AND (${speechiness} + 0.2)
        ELSE s.speechiness BETWEEN 0 AND 1
        END)  
      AND 
        (CASE WHEN ${instrumentalness} <> -1 THEN s.instrumentalness BETWEEN (${instrumentalness} - 0.2) AND (${instrumentalness} + 0.2)
        ELSE s.instrumentalness BETWEEN 0 AND 1
        END)
      AND 
        (CASE WHEN ${liveness} <> -1 THEN s.liveness BETWEEN (${liveness} - 0.1) AND (${liveness} + 0.1)
        ELSE s.liveness BETWEEN 0 AND 1
        END)
      AND 
        (CASE WHEN ${tempo} <> -1 THEN s.tempo BETWEEN (${tempo} - 20) AND (${tempo} + 20)
        ELSE s.tempo BETWEEN 0 AND 250
        END)
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
  searchArtistStats,
  searchAlbumStats,
  searchSongStats,
  recommendSongs
}
