use project;

SELECT * FROM Song LIMIT 20;


/* 
Query 9

Identify songs with most similar attributes to the input values. 
User inputs (0 or 1) determine whether or not the algorithm includes specific traits. 
This will be used in our Song Recommender.
Input: 		song_id, user input values for song attributes, user input 0/1 indicators for each song attribute
Return: 	song_name, song_id, artist_name, artist_id, album_name, album_id, score

Note:	Change "2LqoYvMudv9xoTqNLFKILj" (t1.id) with ${song_id} for final report, 
	Change "1" (multiplied by song attributes in score) with corresponding boolean user inputs (each "1" represents a seperate input variable)

NEEDS MORE OPTIMIZATION
*/


/* 9 slow */
SELECT 
	t1.name AS song_name
	, t1.id AS song_id
	, t3.name AS artist_name
	, t3.id AS artist_id
	, t2.title AS album_name
	, t2.id AS album_id
	, ABS(( Input_song.danceability - t1.danceability) * 1)
		+ ABS(( Input_song.energy - t1.energy) * 1)
		+ ABS(( Input_song.loudness - t1.loudness) * 0.0157 * 1)
		+ ABS(( Input_song.acousticness - t1.acousticness) * 1)
		+ ABS(( Input_song.speechiness - t1.speechiness) * 1)
		+ ABS(( Input_song.instrumentalness - t1.instrumentalness) * 1)
		+ ABS(( Input_song.liveness - t1.liveness) * 1)
		+ ABS(( Input_song.tempo - t1.tempo ) * 0.0041 * 1)
		+ ABS(( Input_song.valence - t1.valence ) * 1)
		+ ABS(( Input_song.album_release_year - t2.release_year)* 0.0145 * 1)
		+ ABS(( Input_song.album_aoty_critic_score - t2.aoty_critic_score) * 0.01 * 1)
		+ ABS(( Input_song.album_aoty_user_score - t2.aoty_user_score) * 0.01 * 1)
		+ CASE WHEN (Input_song.artist_id = t2.artist_id) THEN -0.1 * 1 ELSE 0 END
		+ CASE WHEN (Input_song.album_id = t1.album_id) THEN -0.1 * 1 ELSE 0 END
		+ CASE WHEN (Input_song.genre_id = t2.genre_id) THEN -0.1 * 1 ELSE 0 END
		+ CASE WHEN (Input_song.record_label_id = t2.record_label_id ) THEN -0.1 * 1 ELSE 0 END
		+ CASE WHEN (Input_song.album_format = t2.format ) THEN -0.1 * 1 ELSE 0 END
    AS score
FROM 
	Song t1 
	LEFT JOIN Album t2 ON t1.album_id = t2.id
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	JOIN (
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
			, t1.valence AS valence
			, t2.title AS album_name
			, t2.artist_id AS artist_id
			, t2.genre_id AS genre_id
			, t2.record_label_id AS record_label_id
			, t2.format AS album_format
			, t2.release_year AS album_release_year
			, t2.aoty_critic_score AS album_aoty_critic_score
			, t2.aoty_user_score AS album_aoty_user_score
			, t3.name AS artist_name
		FROM Song t1 
			LEFT JOIN Album t2 ON t1.album_id = t2.id
			LEFT JOIN Artist t3 ON t2.artist_id = t3.id
			HAVING t1.id =  "2LqoYvMudv9xoTqNLFKILj"
	) Input_song
WHERE 
	t1.id != Input_song.song_id 
	AND  t2.genre_id IN (  
		SELECT genre_matches
		FROM SimilarGenres
		WHERE genre_code = 
			CASE 
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




/* 9 fast */
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
		, t1.valence AS valence
		, t2.title AS album_name
		, t2.artist_id AS artist_id
		, t2.genre_id AS genre_id
		, t2.record_label_id AS record_label_id
		, t2.format AS album_format
		, t2.release_year AS album_release_year
		, t2.aoty_critic_score AS album_aoty_critic_score
		, t2.aoty_user_score AS album_aoty_user_score
		, t3.name AS artist_name
	FROM Song t1 
		LEFT JOIN Album t2 ON t1.album_id = t2.id
		LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	WHERE t1.id =  "2LqoYvMudv9xoTqNLFKILj"
)
SELECT 
	t1.name AS song_name,
	t1.id AS song_id
	, t3.name AS artist_name
	, t3.id AS artist_id
	, t2.title AS album_name
	, t2.id AS album_id
	, ABS(( Input_song.danceability - t1.danceability) * 1)
		+ ABS(( Input_song.energy - t1.energy) * 1)
		+ ABS(( Input_song.loudness - t1.loudness) * 0.0157 * 1)
		+ ABS(( Input_song.acousticness - t1.acousticness) * 1)
		+ ABS(( Input_song.speechiness - t1.speechiness) * 1)
		+ ABS(( Input_song.instrumentalness - t1.instrumentalness) * 1)
		+ ABS(( Input_song.liveness - t1.liveness) * 1)
		+ ABS(( Input_song.tempo - t1.tempo ) * 0.0041 * 1)
		+ ABS(( Input_song.valence - t1.valence ) * 1)
		+ ABS(( Input_song.album_release_year - t2.release_year)* 0.0145 * 1)
		+ ABS(( Input_song.album_aoty_critic_score - t2.aoty_critic_score) * 0.01 * 1)
		+ ABS(( Input_song.album_aoty_user_score - t2.aoty_user_score) * 0.01 * 1)
		+ CASE WHEN (Input_song.artist_id = t2.artist_id) THEN -0.1 * 1 ELSE 0 END
		+ CASE WHEN (Input_song.album_id = t1.album_id) THEN -0.1 * 1 ELSE 0 END
		+ CASE WHEN (Input_song.genre_id = t2.genre_id) THEN -0.1 * 1 ELSE 0 END
		+ CASE WHEN (Input_song.record_label_id = t2.record_label_id ) THEN -0.1 * 1 ELSE 0 END
		+ CASE WHEN (Input_song.album_format = t2.format ) THEN -0.1 * 1 ELSE 0 END
    AS score
FROM 
	Song t1 
	LEFT JOIN Album t2 ON t1.album_id = t2.id
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
    JOIN Input_song
WHERE 
	t1.id != Input_song.song_id 
	AND  t2.genre_id IN (  
		SELECT genre_matches
		FROM SimilarGenres
		WHERE genre_code = 
			CASE 
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




/* 
Query 10

Identify album with most similarity to  input song values (comparing the average song scores) 
and input aritst traits. 
This will be used in our Album Recommender.
User inputs (0 or 1) determine whether or not the algorithm includes specific traits. 
Input: 	album_id, user input values for song attributes, user input 0/1 indicators for each song attribute
Return:	album_name, album_id, artist_name, artist_id, score

Note:	Change "0oX4SealMgNXrvRDhqqOKg" (t2.id) with ${album_id} for final report, 
	Change "1" (multiplied by song attributes in score) with corresponding boolean user inputs (each "1" represents a seperate input variable)

NEEDS OPTIMIZATION
*/


/* 10 */
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
		, AVG(t1.duration_ms) AS avg_duration
	FROM  Song t1
		LEFT JOIN Album t2 ON t1.album_id = t2.id
		LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	WHERE t2.id = '0oX4SealMgNXrvRDhqqOKg'
)
SELECT *
FROM (
	SELECT
		Other_album.artist_name AS artist_name
		, Other_album.artist_id AS artist_id
		, Other_album.album_name AS album_name
		, Other_album.album_id AS album_id
		, ABS(( Input_album.avg_danceability - Other_album.avg_danceability) * 1)
			+ ABS(( Input_album.avg_energy - Other_album.avg_energy) * 1)
			+ ABS(( Input_album.avg_loudness - Other_album.avg_loudness) * 0.0157 * 1)
			+ ABS(( Input_album.avg_acousticness - Other_album.avg_acousticness) * 1)
			+ ABS(( Input_album.avg_speechiness - Other_album.avg_speechiness) * 1)
			+ ABS(( Input_album.avg_instrumentalness - Other_album.avg_instrumentalness) * 1)
			+ ABS(( Input_album.avg_liveness - Other_album.avg_liveness) * 1)
			+ ABS(( Input_album.avg_tempo - Other_album.avg_tempo ) * 0.0041 * 1)
			+ ABS(( Input_album.avg_valence - Other_album.avg_valence ) * 1)
			+ ABS(( Input_album.avg_duration - Other_album.avg_duration ) /5000000 * 1)
			+ ABS(( Input_album.album_release_year - Other_album.album_release_year)* 0.0145 * 1)
			+ ABS(( Input_album.album_critic_score - Other_album.album_critic_score) * 0.01 * 1)
			+ ABS(( Input_album.album_user_score - Other_album.album_user_score) * 0.01 * 1)
			+ CASE WHEN (Input_album.artist_id = Other_album.artist_id) THEN -0.1 * 1 ELSE 0 END
			+ CASE WHEN (Input_album.genre_id = Other_album.genre_id) THEN -0.1 * 1 ELSE 0 END
			+ CASE WHEN (Input_album.record_label_id = Other_album.record_label_id ) THEN -0.1 * 1 ELSE 0 END
			+ CASE WHEN (Input_album.album_format = Other_album.album_format ) THEN -0.1 * 1 ELSE 0 END
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
			, AVG(t1.duration_ms) AS avg_duration
		FROM Album t2 
			LEFT JOIN Song t1  ON t1.album_id = t2.id
			LEFT JOIN Artist t3 ON t2.artist_id = t3.id
		GROUP BY t2.id
	) Other_album
	JOIN Input_album
	WHERE 
		Other_album.album_id != Input_album.album_id 
		AND  Other_album.genre_id IN (  
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







/* 
Query 11

Identify artists with most similarity to input song values (comparing the average song scores) 
and input aritst traits. 
This will be used in our Artist Recommender.
User inputs (0 or 1) determine whether or not the algorithm includes specific traits. 
Input: 	artist_id, user input values for each song attribute, user input 0/1 indicators for each song attribute
Return: artist_name, artist_id, score

Note:	Change "3fMbdgg4jU18AjLCKBhRSm" (t3.id) with ${artist_id} for final report, 
	Change 5 (multiplied by song attributes in score) with corresponding user inputs (each 5 represents a seperate input variable)

NEEDS OPTIMIZATION
SAME RECORD LABELS?
AVG RELEASE YEAR?
COUNT OF GENRE MATCHES?
*/


/* 11 */
WITH Input_artist AS (
	SELECT
		t2.id AS album_id
		, t3.id AS artist_id
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
		, AVG(t1.duration_ms) AS avg_duration
	FROM  Song t1
		LEFT JOIN Album t2 ON t1.album_id = t2.id
		LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	WHERE t3.id = '3fMbdgg4jU18AjLCKBhRSm'
),
Input_album_genres AS (
	SELECT DISTINCT t5.id AS genre_id
	FROM  Album t2 
		LEFT JOIN Artist t3 ON t2.artist_id = t3.id
        LEFT JOIN Genre t5 ON t2.genre_id = t5.id
	WHERE t3.id = '3fMbdgg4jU18AjLCKBhRSm'
),
Other_artist AS (
	SELECT 
			t3.name AS artist_name
			, t3.id AS artist_id
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
			, AVG(t1.duration_ms) AS avg_duration
		FROM  Song t1
			LEFT JOIN Album t2 ON t1.album_id = t2.id
			LEFT JOIN Artist t3 ON t2.artist_id = t3.id
		GROUP BY t3.id
) 
SELECT *
FROM (
	SELECT
		Other_artist.artist_name AS artist_name
		, Other_artist.artist_id AS artist_id
		, ABS(( Input_artist.avg_danceability - Other_artist.avg_danceability) * 1)
			+ ABS(( Input_artist.avg_energy - Other_artist.avg_energy) * 1)
			+ ABS(( Input_artist.avg_loudness - Other_artist.avg_loudness) * 0.0157 * 1)
			+ ABS(( Input_artist.avg_acousticness - Other_artist.avg_acousticness) * 1)
			+ ABS(( Input_artist.avg_speechiness - Other_artist.avg_speechiness) * 1)
			+ ABS(( Input_artist.avg_instrumentalness - Other_artist.avg_instrumentalness) * 1)
			+ ABS(( Input_artist.avg_liveness - Other_artist.avg_liveness) * 1)
			+ ABS(( Input_artist.avg_tempo - Other_artist.avg_tempo ) * 0.0041 * 1)
			+ ABS(( Input_artist.avg_valence - Other_artist.avg_valence ) * 1)
			+ ABS(( Input_artist.avg_duration - Other_artist.avg_duration ) /5000000 * 1)
			+ ABS(( Input_artist.album_critic_score - Other_artist.album_critic_score) * 0.01 * 1)
			+ ABS(( Input_artist.album_user_score - Other_artist.album_user_score) * 0.01 * 1)
		AS score
	FROM Other_artist JOIN Input_artist
	WHERE Other_artist.artist_id != Input_artist.artist_id 
		AND EXISTS (
			SELECT DISTINCT t5.id AS genre_id
			FROM  Album t2 
				LEFT JOIN Artist t3 ON t2.artist_id = t3.id
				LEFT JOIN Genre t5 ON t2.genre_id = t5.id
			WHERE t3.id = Other_artist.artist_id
				AND genre_id IN (
					SELECT genre_matches
					FROM Input_album_genres JOIN SimilarGenres ON Input_album_genres.genre_id=SimilarGenres.genre_code
				) 
		) 
) x 
WHERE score IS NOT NULL 
ORDER BY score ASC
LIMIT 50;
