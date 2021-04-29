use project;

SELECT * FROM Song LIMIT 20;


/* 
Query 9

Identify songs with most similar attributes to the input values. 
User inputs (0 or 1) determine whether or not the algorithm includes specific traits. 
This will be used in our Song Recommender.
Input: 		- song_id = "2LqoYvMudv9xoTqNLFKILj" line 141
			- user input values for song attributes: 
				danceability value = "5" line 153 
				energy value = "5" line 154
				loudness value = "5" line 155
				acousticness value = "5" line 156
				speechiness value = "5" line 157
				insttrumentalness value = "5" line 158
				liveness value = "5" line 159
				tempo value = "5" line 160
				valence value = "5" line 161
				min release year = "1990" line 172
				max release year=  "2021" line 173
			- user input 0/1 boolean indicators for each song attribute:
				include danceability = "1" line 153
				include energy = "1" line 154
				include loudness = "1" line 155 
				include acousticness = "1" line 156
				include speechiness = "1" line 157
				include insttrumentalness = "1" line 158
				include liveness = "1" line 159
				include tempo = "1" line 160
				include valence = "1" line 161
				same artist (1 -> must be same artist, 0 -> any artist) = "0" line 179
				same album (1 -> must be same album, 0 -> any album) = "0" line 190
				same record label (1 -> must be same record label, 0 -> any record label) = "0" line 181
				same_genre (1 -> must be same/similar genre, 0 -> any genre) = "1" line 162 ALSO = "1" line 187 (same input in two places)
Return: 	song_name, song_id, artist_name, artist_id, album_name, album_id, score
*/

/* 9 SLOW */
SELECT 
	t1.name AS song_name
	, t1.id AS song_id
	, t3.name AS artist_name
	, t3.id AS artist_id
	, t2.title AS album_name
	, t2.id AS album_id
	, ABS(( 5 - t1.danceability) * 1.5 * 1) 
		+ ABS(( 5 - t1.energy) * 1.5 * 1)
		+ ABS(( 5 - t1.loudness) * 1.5 * 0.0157 * 1)
		+ ABS(( 5 - t1.acousticness) * 1)			
		+ ABS(( 5 - t1.speechiness) * 1)
		+ ABS(( 5 - t1.instrumentalness) * 1)
		+ ABS(( 5 - t1.liveness) * 1)
		+ ABS(( 5 - t1.tempo ) * 0.0041 * 1)
		+ ABS(( 5 - t1.valence ) * 1)
		+ CASE WHEN (Input_song.genre_id = t2.genre_id) THEN -0.4 * 1 ELSE 0 END
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
			, t3.name AS artist_name
		FROM Song t1 
			LEFT JOIN Album t2 ON t1.album_id = t2.id
			LEFT JOIN Artist t3 ON t2.artist_id = t3.id
			HAVING t1.id =  "2LqoYvMudv9xoTqNLFKILj"
	) Input_song
WHERE 
	t1.id != Input_song.song_id 
	AND t2.release_year >= 1990
	AND t2.release_year <= 2021
	AND t2.artist_id = (CASE WHEN (0 = 0) THEN t2.artist_id ELSE Input_song.artist_id END)
	AND t1.album_id = (CASE WHEN (0 = 0) THEN t1.album_id ELSE Input_song.album_id END)
	AND t2.record_label_id = (CASE WHEN (0 = 0) THEN t2.record_label_id ELSE Input_song.record_label_id END)
	AND t2.genre_id IN (  
		SELECT genre_matches
		FROM SimilarGenres
		WHERE genre_code = 
			CASE 
			 	WHEN (0 = 1) THEN 6
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




/* 9 FAST 
JOINs instead of LEFT JOIN, 
Making Input_song a CTE so that it is not run more than once.
pushing selections before JOIN,
use smaller dataset as the outer loop in joins 
remove unecessary columns */
WITH Input_song AS (
	SELECT
		t1.name AS song_name
		, t1.id AS song_id
		, t1.album_id AS album_id
		, t2.title AS album_name
		, t2.artist_id AS artist_id
		, t2.genre_id AS genre_id
		, t2.record_label_id AS record_label_id
		, t2.release_year AS album_release_year
		, t3.name AS artist_name
	FROM (
		SELECT *
		FROM Song
		WHERE id =  "2LqoYvMudv9xoTqNLFKILj"
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
	, ABS(( Input_song.danceability - t1.danceability) * 1)
		+ ABS(( Input_song.energy - t1.energy) * 1)
		+ ABS(( Input_song.loudness - t1.loudness) * 0.0157 * 1)
		+ ABS(( Input_song.acousticness - t1.acousticness) * 1)
		+ ABS(( Input_song.speechiness - t1.speechiness) * 1)
		+ ABS(( Input_song.instrumentalness - t1.instrumentalness) * 1)
		+ ABS(( Input_song.liveness - t1.liveness) * 1)
		+ ABS(( Input_song.tempo - t1.tempo ) * 0.0041 * 1)
		+ ABS(( Input_song.album_release_year - t2.release_year)* 0.0145 * 1)
		+ CASE WHEN (Input_song.artist_id = t2.artist_id) THEN -0.1 ELSE 0 END
		+ CASE WHEN (Input_song.album_id = t1.album_id) THEN -0.03 ELSE 0 END
		+ CASE WHEN (Input_song.record_label_id = t2.record_label_id ) THEN -0.1 ELSE 0 END
        + CASE WHEN (Input_song.genre_id = t2.genre_id) THEN -0.4 * 1 ELSE 0 END
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
				WHEN (0 = 1) THEN 6
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
and input album traits. 
This will be used in our Album Recommender.
User inputs (0 or 1) determine whether or not the algorithm includes specific traits. 
Input: 		album_id = "0oX4SealMgNXrvRDhqqOKg" line 371
Return:		album_name, album_id, artist_name, artist_id, score

*/

/* 10 SLOW */
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
		, ABS(( 5 - Other_album.avg_danceability) * 1.5 * 1)
			+ ABS(( 5 - Other_album.avg_energy) * 1.5 * 1)
			+ ABS(( 5 - Other_album.avg_loudness) * 1.5 * 0.0157 * 1)
			+ ABS(( 5 - Other_album.avg_acousticness) * 1)
			+ ABS(( 5 - Other_album.avg_speechiness) * 1)
			+ ABS(( 5 - Other_album.avg_instrumentalness) * 1)
			+ ABS(( 5 - Other_album.avg_liveness) * 1)
			+ ABS(( 5 - Other_album.avg_tempo ) * 0.0041 * 1)
			+ ABS(( 5 - Other_album.avg_valence ) * 1)
			+ ABS(( Input_album.album_critic_score - Other_album.album_critic_score) * 0.01 * 1)
			+ ABS(( Input_album.album_user_score - Other_album.album_user_score) * 0.01 * 1)
			+ CASE WHEN (Input_album.genre_id = Other_album.genre_id) THEN -0.4 * 1 ELSE 0 END
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
		FROM Album t2 
			LEFT JOIN Song t1  ON t1.album_id = t2.id
			LEFT JOIN Artist t3 ON t2.artist_id = t3.id
		GROUP BY t2.id
	) Other_album
	JOIN Input_album
	WHERE 
		Other_album.album_id != Input_album.album_id 
		AND Other_album.album_release_year >= 1980
		AND Other_album.album_release_year <= 2021
		AND Other_album.artist_id = (CASE WHEN (0 = 0) THEN Other_album.artist_id ELSE Input_album.artist_id END)
		AND Other_album.album_format = (CASE WHEN (0 = 0) THEN Other_album.album_format ELSE Input_album.album_format END)
		AND Other_album.record_label_id = (CASE WHEN (0 = 0) THEN Other_album.record_label_id ELSE Input_album.record_label_id END)
		AND Other_album.genre_id IN (  
			SELECT genre_matches
			FROM SimilarGenres
			WHERE genre_code = 
				CASE 
					WHEN (0 = 1) THEN 6
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







/* 10 FAST 
JOINs instead of LEFT JOIN, 
pushing selections before JOIN,
use smaller dataset as the outer loop in joins, 
remove unecessary columns */
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
		WHERE id = '0oX4SealMgNXrvRDhqqOKg'
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








/* 
Query 11

Identify artists with most similarity to input song values (comparing the average song scores) 
and input aritst traits. 
This will be used in our Artist Recommender.
User inputs (0 or 1) determine whether or not the algorithm includes specific traits. 
Input: 	artist_id
Return: artist_name, artist_id, score

Note:	Change "3fMbdgg4jU18AjLCKBhRSm" (t3.id) with ${artist_id} for final report, 
*/


/* 11 */
WITH Input_artist AS (
	SELECT
		t2.id AS album_id
		, t3.id AS artist_id
		, t2.aoty_critic_score AS album_critic_score
		, t2.aoty_user_score AS album_user_score
		, t2.num_aoty_critic_reviews AS num_critic_reviews
		, t2.num_aoty_user_reviews AS num_user_reviews
		, t2.record_label_id AS record_label_id
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
Input_artist_genre AS (
	SELECT 
		genre_id
	FROM  (
		SELECT t5.id AS genre_id
        FROM Album t2 
        JOIN (
			SELECT *
            FROM Artist
            WHERE id = '3fMbdgg4jU18AjLCKBhRSm'
		) t3 ON t2.artist_id = t3.id
		JOIN Genre t5 ON t2.genre_id = t5.id
        ) x
	GROUP BY genre_id
    ORDER BY COUNT(genre_id) DESC
    LIMIT 1
),
Other_artist AS (
	SELECT 
			t3.name AS artist_name
			, t3.id AS artist_id
			, t2.aoty_critic_score AS album_critic_score
			, t2.aoty_user_score AS album_user_score
			, t2.num_aoty_critic_reviews AS num_critic_reviews
			, t2.num_aoty_user_reviews AS num_user_reviews
			, t2.record_label_id AS record_label_id
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
			JOIN Album t2 ON t1.album_id = t2.id
			JOIN Artist t3 ON t2.artist_id = t3.id
		GROUP BY t3.id
), 
Other_artist_genre AS(
 	SELECT genre_id
	FROM  (
		SELECT t5.id AS genre_id
		FROM Album t2 
		JOIN Other_artist t3 ON t2.artist_id = t3.artist_id
		JOIN Genre t5 ON t2.genre_id = t5.id
	) x
	GROUP BY genre_id
	ORDER BY COUNT(genre_id) DESC
	LIMIT 1
)
SELECT *
FROM (
	SELECT
		Other_artist.artist_name AS artist_name
		, Other_artist.artist_id AS artist_id
		, ABS(( Input_artist.avg_danceability - Other_artist.avg_danceability) * 1.5)
			+ ABS(( Input_artist.avg_energy - Other_artist.avg_energy) * 1.5)
			+ ABS(( Input_artist.avg_loudness - Other_artist.avg_loudness) * 1.5 * 0.0157)
			+ ABS(( Input_artist.avg_acousticness - Other_artist.avg_acousticness))
			+ ABS(( Input_artist.avg_speechiness - Other_artist.avg_speechiness))
			+ ABS(( Input_artist.avg_instrumentalness - Other_artist.avg_instrumentalness))
			+ ABS(( Input_artist.avg_liveness - Other_artist.avg_liveness))
			+ ABS(( Input_artist.avg_tempo - Other_artist.avg_tempo ) * 0.0041)
			+ ABS(( Input_artist.avg_valence - Other_artist.avg_valence ))
			+ ABS(( Input_artist.avg_duration - Other_artist.avg_duration ) /5000000)
			+ ABS(( Input_artist.album_user_score - Other_artist.album_user_score) * 0.01)
			+ (ABS(( Input_artist.album_critic_score - Other_artist.album_critic_score) * 0.01) *
			CASE WHEN (Input_artist.num_critic_reviews > 10 AND Other_artist.num_critic_reviews > 10) THEN 1 ELSE 0 END)
			+ (ABS(( Input_artist.album_user_score - Other_artist.album_user_score) * 0.01) * 
			CASE WHEN (Input_artist.num_user_reviews > 10 AND Other_artist.num_user_reviews > 10) THEN 1 ELSE 0 END)
			+ CASE WHEN (Input_artist.record_label_id = Other_artist.record_label_id) THEN -0.3 ELSE 0 END
		AS score
	FROM Other_artist
		JOIN Input_artist
		JOIN Input_artist_genre
		JOIN Other_artist_genre
	WHERE Input_artist_genre.genre_id = Other_artist_genre.genre_id
		AND Input_artist.artist_id != Other_artist.artist_id
) x 
WHERE score IS NOT NULL 
ORDER BY score ASC
LIMIT 50;
