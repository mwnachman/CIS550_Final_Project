const axios = require('axios')
const config = require('./config/server.json')
const mysql = require('mysql')

const aws_config = config['aws-mysql']
aws_config.connectionLimit = 10
aws_config.waitForConnections = true
const con = mysql.createPool(aws_config)

const APIRoot = config.BASE_URL.prod


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
  con.query(query, function(err, rows) {
    if (err) console.error(err);
    else {
      res.json(rows);
    }
  });
}

function getAllAlbums(req, res) {
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
function top5(req, res) {
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
function traitByGenre(req, res) {
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
function searchSong(req, res) {
  const query = `
  SELECT
	t1.name AS song_name
	, t1.id AS song_id
	, t2.title AS album_name
  , t2.id AS album_id
	, t3.name AS artist_name
  , t3.id AS artist_id
	, t2.release_year AS release_year
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
function searchArtist(req, res) {
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
function searchAlbum(req, res) {
  const query = `
  SELECT
  	t2.title AS album_name
  	, t2.id AS album_id
  	, t3.name AS artist_name
    , t3.id AS artist_id
  	, t2.release_year AS release_year
  	, t2.format AS album_format
  	, t4.name AS record_label_name
    , t5.url AS review_url
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
    LEFT OUTER JOIN PitchforkReviews t5 on t2.id = t5.album_id
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
function searchArtistAlbums(req, res) {
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
function searchArtistStats(req, res) {
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
function searchAlbumAllSongs(req, res) {
  const query = `
  SELECT
    track_number, 
    CONCAT(FLOOR(duration_ms/60000), ':', LPAD(ROUND((MOD(duration_ms, 60000) / 1000),0),2,0)) AS time_seconds,
    name AS song_name,
    id AS song_id,
    danceability,
    energy,
    loudness,
    acousticness,
    speechiness,
    instrumentalness,
    liveness,
    tempo
  FROM Song
  WHERE album_id = '`+req.params.album+`'
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
function searchAlbumStats(req, res) {
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
		, t6.url AS review_url
	FROM  (
		SELECT *
		FROM Album
		WHERE id = `+req.params.album+`
	) t2 
		LEFT JOIN (
			SELECT album_id, url
			FROM PitchforkReviews 
			WHERE album_id = `+req.params.album+`
			ORDER BY score DESC
			LIMIT 1
		) t6 ON t2.id = t6.album_id
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
function searchSongStats(req, res) {
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
function recommendSongs(req, res) {
  let incl = JSON.parse(req.query.include)
  let vals = JSON.parse(req.query.sliderValues)
  let song = JSON.parse(req.query.songInfo)
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
  const query = `
    WITH Input_song AS (
      SELECT
        t1.name AS song_name
        , t1.id AS song_id
        , t1.album_id AS album_id
        , t1.danceability AS danceability 
        , t1.energy AS energy
        , t1.loudness AS loudness
        , t1.acousticness AS acousticness
        , t1.speechiness AS speechiness
        , t1.instrumentalness AS instrumentalness
        , t1.liveness AS liveness
        , t1.tempo AS tempo
        , t2.title AS album_name
        , t2.artist_id AS artist_id
        , t2.genre_id AS genre_id
        , t2.record_label_id AS record_label_id
        , t2.release_year AS album_release_year
        , t3.name AS artist_name
      FROM (
        SELECT *
        FROM Song
        WHERE id =  "${songId}" 
      )t1
        JOIN Album t2 ON t1.album_id = t2.id
        JOIN Artist t3 ON t2.artist_id = t3.id
    )
    SELECT 
      t1.name AS song_name
      , t1.id AS song_id
      , t3.name AS artist_name
      , t3.id AS artist_id
      , t2.title AS album_name
      , t2.id AS album_id
      , ABS(( ${danceability} - t1.danceability) * CASE WHEN ${incl.danceability} THEN 1 ELSE 0 END)
        + ABS(( ${energy} - t1.energy) * CASE WHEN ${incl.energy} THEN 1 ELSE 0 END)
        + ABS(( ${loudness} - t1.loudness) * 0.0157 * CASE WHEN ${incl.loudness} THEN 1 ELSE 0 END)
        + ABS(( ${acousticness} - t1.acousticness) * CASE WHEN ${incl.acousticness} THEN 1 ELSE 0 END)
        + ABS(( ${speechiness} - t1.speechiness) * CASE WHEN ${incl.speechiness} THEN 1 ELSE 0 END)
        + ABS(( ${instrumentalness} - t1.instrumentalness) * CASE WHEN ${incl.instrumentalness} THEN 1 ELSE 0 END) 
        + ABS(( ${liveness} - t1.liveness) * CASE WHEN ${incl.liveness} THEN 1 ELSE 0 END)
        + ABS(( ${tempo} - t1.tempo ) * 0.0041 * CASE WHEN ${incl.tempo} THEN 1 ELSE 0 END)
        + ABS(( ${release_year} - t2.release_year)* 0.0145 * CASE WHEN ${incl.release_year} THEN 1 ELSE 0 END)
        + CASE WHEN (Input_song.artist_id = t2.artist_id) THEN -0.1 ELSE 0 END
        + CASE WHEN (Input_song.album_id = t1.album_id) THEN -0.03 ELSE 0 END
        + CASE WHEN (Input_song.record_label_id = t2.record_label_id ) THEN -0.1 ELSE 0 END
        + CASE WHEN (Input_song.genre_id = t2.genre_id) THEN -0.4 * (CASE WHEN ${incl.genre} THEN 1 ELSE 0 END) ELSE 0 END
        AS score
    FROM 
      Song t1 
      JOIN Album t2 ON t1.album_id = t2.id
      JOIN Artist t3 ON t2.artist_id = t3.id
        JOIN Input_song
    WHERE 
      t1.id != Input_song.song_id 
      AND  t2.genre_id IN (  
        SELECT genre_matches
        FROM SimilarGenres
        WHERE genre_code = 
          CASE 
            WHEN (0 = ${incl.genre}) THEN 6
            WHEN (Input_song.genre_id = 0) THEN 0
            WHEN (Input_song.genre_id = 1) THEN 1
            WHEN (Input_song.genre_id = 2) THEN 2
            WHEN (Input_song.genre_id = 3) THEN 3
            WHEN (Input_song.genre_id = 4) THEN 4
            WHEN (Input_song.genre_id = 5) THEN 5
            WHEN (Input_song.genre_id = 6) THEN 6
            WHEN (Input_song.genre_id = 7) THEN 7
            WHEN (Input_song.genre_id = 8) THEN 8
          END
      ) 
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


/*-- q10: Identify albums with most similar attributes of the input album. This will be used in our Recommender tab. --*/
function recommendAlbum(req, res) {
  const query = `
	WITH Input_album AS (
		SELECT
			t2.id AS album_id
			, t2.release_year AS album_release_year
			, t3.id AS artist_id
			, t2.format AS album_format
			, t2.record_label_id AS record_label_id
			, t2.genre_id AS genre_id
			, t2.aoty_critic_score AS album_critic_score
			, t2.aoty_user_score AS album_user_score
			, AVG(t1.danceability) AS avg_danceability
			, AVG(t1.energy) AS avg_energy
			, AVG(t1.loudness) AS avg_loudness
			, AVG(t1.acousticness) AS avg_acousticness
			, AVG(t1.speechiness) AS avg_speechiness
			, AVG(t1.instrumentalness) AS avg_instrumentalness
			, AVG(t1.liveness) AS avg_liveness
			, AVG(t1.tempo) AS avg_tempo
			, AVG(t1.valence) AS avg_valence
		FROM (
			SELECT *
			FROM Album 
			WHERE id = `+req.params.album+`
		) t2 
			JOIN Artist t3 ON t2.artist_id = t3.id
			JOIN Song t1 ON t1.album_id = t2.id
	)
	SELECT *
	FROM (
		SELECT 
			Other_album.artist_name AS artist_name
			, Other_album.artist_id AS artist_id
			, Other_album.album_name AS album_name
			, Other_album.album_id AS album_id
			, ABS(( Input_album.avg_danceability - Other_album.avg_danceability) * 1.5)
				+ ABS(( Input_album.avg_energy - Other_album.avg_energy) * 1.5 )
				+ ABS(( Input_album.avg_loudness - Other_album.avg_loudness) * 1.5 * 0.0157)
				+ ABS(( Input_album.avg_acousticness - Other_album.avg_acousticness))
				+ ABS(( Input_album.avg_speechiness - Other_album.avg_speechiness))
				+ ABS(( Input_album.avg_instrumentalness - Other_album.avg_instrumentalness))
				+ ABS(( Input_album.avg_liveness - Other_album.avg_liveness) )
				+ ABS(( Input_album.avg_tempo - Other_album.avg_tempo ) * 0.0041 )
				+ ABS(( Input_album.avg_valence - Other_album.avg_valence ) )
				+ ABS(( Input_album.album_critic_score - Other_album.album_critic_score) * 0.01 )
				+ ABS(( Input_album.album_critic_score - Other_album.album_user_score) * 0.01 )
				+ ABS(( Input_album.album_release_year- Other_album.album_release_year)* 0.0145 )
				+ CASE WHEN (Input_album.genre_id = Other_album.genre_id) THEN -0.4  ELSE 0 END
				+ CASE WHEN (Input_album.artist_id = Other_album.artist_id) THEN -0.1  ELSE 0 END
				+ CASE WHEN (Input_album.album_format = Other_album.album_format) THEN -0.01 ELSE 0 END
				+ CASE WHEN (Input_album.record_label_id = Other_album.record_label_id) THEN -0.1 ELSE 0 END
			AS score
		FROM (
			SELECT 
				t2.title AS album_name
				, t2.id AS album_id
				, t3.name AS artist_name
				, t3.id AS artist_id
				, t2.release_year AS album_release_year
				, t2.format AS album_format
				, t2.record_label_id AS record_label_id
				, t2.genre_id AS genre_id
				, t2.aoty_critic_score AS album_critic_score
				, t2.aoty_user_score AS album_user_score
				, AVG(t1.danceability) AS avg_danceability
				, AVG(t1.energy) AS avg_energy
				, AVG(t1.loudness) AS avg_loudness
				, AVG(t1.acousticness) AS avg_acousticness
				, AVG(t1.speechiness) AS avg_speechiness
				, AVG(t1.instrumentalness) AS avg_instrumentalness
				, AVG(t1.liveness) AS avg_liveness
				, AVG(t1.tempo) AS avg_tempo
				, AVG(t1.valence) AS avg_valence
				+ CASE WHEN (Input_album.record_label_id = Other_album.record_label_id) THEN -0.1 ELSE 0 END
			FROM Album t2 
				JOIN Artist t3 ON t2.artist_id = t3.id
				JOIN Song t1  ON t1.album_id = t2.id
			GROUP BY t2.id
	) Other_album
		JOIN Input_album
		WHERE 
			Other_album.album_id != Input_album.album_id 
			AND Other_album.genre_id IN (  
				SELECT genre_matches
				FROM SimilarGenres
				WHERE genre_code = 
					CASE 
						WHEN (Input_album.genre_id = 0) THEN 0
						WHEN (Input_album.genre_id = 1) THEN 1
						WHEN (Input_album.genre_id = 2) THEN 2
						WHEN (Input_album.genre_id = 3) THEN 3
						WHEN (Input_album.genre_id = 4) THEN 4
						WHEN (Input_album.genre_id = 5) THEN 5
						WHEN (Input_album.genre_id = 6) THEN 6
						WHEN (Input_album.genre_id = 7) THEN 7
						WHEN (Input_album.genre_id = 8) THEN 8
					END
			) 
	) x 
	WHERE score IS NOT NULL
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



async function getAlbumArt(req, res) {
  try {
    const promise = await axios({
      method: 'GET',
      url: `${APIRoot}/getartwork/?song=&artist=&album=${req.params.album}`
    })
    if (promise.status == 200) {
      res.json(promise.data)
    }
  } catch (error) {
    console.error(error)
  }
}

async function getSongUrl(req, res) {
  try {
    const promise = await axios({
      method: 'GET',
      url: `${APIRoot}/getartwork/?artist=&album=&song=${req.params.song}`
    })
    if (promise.status == 200) {
      res.json(promise.data)
    }
  } catch (error) {
    console.error(error)
  }
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
  recommendSongs,
  recommendAlbum,
  getAlbumArt,
  getSongUrl
}
