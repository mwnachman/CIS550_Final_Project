use project;

SELECT * FROM Song LIMIT 20;


/* 
Query 9

Identify songs with most similar attributes to the input song. 
User inputs determine the weight that the algorithm assigns to specific song traits. 
User inputs should be numbers (not necessarily integers) between 0 and 10.
This will be used in our Song Recommender on the Song display page.
Input: 		song_id,  user values on a 0-10 scale for each song attribute
Return: 	song_name, song_id, artist_name, artist_id, album_name, album_id, score

Note:	Change "2LqoYvMudv9xoTqNLFKILj" (t1.id) with ${user_keyword} for final report, 
	Change 5 (multiplied by song attributes in score) with corresponding user inputs (each 5 represents a seperate input variable)
Note:	You must execute CREATE TEMPORARY TABLE Similar_genres &
	INSERT INTO Similar_genres, in order for this to work

NEEDS MORE OPTIMIZATION
*/



/* 9 slow */
CREATE TEMPORARY TABLE Similar_genres (
	genre_code INT NOT NULL,
	genre_matches INT NOT NULL,
	PRIMARY KEY(genre_code, genre_matches)
);
INSERT INTO Similar_genres(genre_code, genre_matches) VALUES 
	(0,0), (0,8), (0,3), (0,7), (0,2),
	(1,1), (1,2), (1,5),
	(2,2), (2,1),
	(3,3), (3,0), (3,8), (3,2),
	(4,4), (4,0), (4,8),
	(5,5), (5,1),
	(6,0), (6,1), (6,2), (6,3), (6,4), (6,5), (6,6), (6,7), (6,8),
	(7,7), (7,8),
	(8,8), (8,0), (8,3)
;
SELECT 
	 t1.name AS song_name
	, t1.id AS song_id
	, t3.name AS artist_name
	, t3.id AS artist_id
	, t2.title AS album_name
	, t2.id AS album_id
	, ABS(( Input_song.danceability - t1.danceability) * 5)
		+ ABS(( Input_song.energy - t1.energy) * 5)
		+ ABS(( Input_song.loudness - t1.loudness) * 0.0157 * 5)
		+ ABS(( Input_song.acousticness - t1.acousticness) * 5)
		+ ABS(( Input_song.speechiness - t1.speechiness) * 5)
		+ ABS(( Input_song.instrumentalness - t1.instrumentalness) * 5)
		+ ABS(( Input_song.liveness - t1.liveness) * 5)
		+ ABS(( Input_song.tempo - t1.tempo ) * 0.0041 * 5)
		+ ABS(( Input_song.valence - t1.valence ) * 5)
		+ ABS(( Input_song.album_release_year - t2.release_year)* 0.0145 * 5)
		+ ABS(( Input_song.album_aoty_critic_score - t2.aoty_critic_score) * 0.01 * 5)
		+ ABS(( Input_song.album_aoty_user_score - t2.aoty_user_score) * 0.01 * 5)
		+ CASE WHEN (Input_song.artist_id = t2.artist_id) THEN -0.1 * 5 ELSE 0 END
		+ CASE WHEN (Input_song.album_id = t1.album_id) THEN -0.1 * 5 ELSE 0 END
		+ CASE WHEN (Input_song.genre_id = t2.genre_id) THEN -0.1 * 5 ELSE 0 END
		+ CASE WHEN (Input_song.record_label_id = t2.record_label_id ) THEN -0.1 * 5 ELSE 0 END
		+ CASE WHEN (Input_song.album_format = t2.format ) THEN -0.1 * 5 ELSE 0 END
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
		FROM Similar_genres
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
DROP TEMPORARY TABLE  Similar_genres;





/* 9 fast */
CREATE TEMPORARY TABLE Similar_genres (
	genre_code INT NOT NULL,
	genre_matches INT NOT NULL,
	PRIMARY KEY(genre_code, genre_matches)
);
INSERT INTO Similar_genres(genre_code, genre_matches) VALUES 
	(0,0), (0,8), (0,3), (0,7), (0,2),
	(1,1), (1,2), (1,5),
	(2,2), (2,1),
	(3,3), (3,0), (3,8), (3,2),
	(4,4), (4,0), (4,8),
	(5,5), (5,1),
	(6,0), (6,1), (6,2), (6,3), (6,4), (6,5), (6,6), (6,7), (6,8),
	(7,7), (7,8),
	(8,8), (8,0), (8,3)
;
Select * from Similar_genres;
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
	, ABS(( Input_song.danceability - t1.danceability) * 5)
		+ ABS(( Input_song.energy - t1.energy) * 5)
		+ ABS(( Input_song.loudness - t1.loudness) * 0.0157 * 5)
		+ ABS(( Input_song.acousticness - t1.acousticness) * 5)
		+ ABS(( Input_song.speechiness - t1.speechiness) * 5)
		+ ABS(( Input_song.instrumentalness - t1.instrumentalness) * 5)
		+ ABS(( Input_song.liveness - t1.liveness) * 5)
		+ ABS(( Input_song.tempo - t1.tempo ) * 0.0041 * 5)
		+ ABS(( Input_song.valence - t1.valence ) * 5)
		+ ABS(( Input_song.album_release_year - t2.release_year)* 0.0145 * 5)
		+ ABS(( Input_song.album_aoty_critic_score - t2.aoty_critic_score) * 0.01 * 5)
		+ ABS(( Input_song.album_aoty_user_score - t2.aoty_user_score) * 0.01 * 5)
		+ CASE WHEN (Input_song.artist_id = t2.artist_id) THEN -0.1 * 5 ELSE 0 END
		+ CASE WHEN (Input_song.album_id = t1.album_id) THEN -0.1 * 5 ELSE 0 END
		+ CASE WHEN (Input_song.genre_id = t2.genre_id) THEN -0.1 * 5 ELSE 0 END
		+ CASE WHEN (Input_song.record_label_id = t2.record_label_id ) THEN -0.1 * 5 ELSE 0 END
		+ CASE WHEN (Input_song.album_format = t2.format ) THEN -0.1 * 5 ELSE 0 END
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
		FROM Similar_genres
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
DROP TEMPORARY TABLE  Similar_genres;



/* 
Query 10

Identify album with most similarity to the input album,
by comparing the average scores of the albums.

This will be used in our Album Recommender on the Album display page.
Input: 	album_id
Return:	album_name, album_id, artist_name, artist_id, score

Note:	Change "0oX4SealMgNXrvRDhqqOKg" (t1.id) with ${user_keyword} for final report, 
	Change 5 (multiplied by song attributes in score) with corresponding user inputs (each 5 represents a seperate input variable)
Note:	You must execute CREATE TEMPORARY TABLE Similar_genres &
	INSERT INTO Similar_genres, in order for this to work


NEEDS OPTIMIZATION
*/


/* 10 */
CREATE TEMPORARY TABLE Similar_genres (
	genre_code INT NOT NULL,
	genre_matches INT NOT NULL,
	PRIMARY KEY(genre_code, genre_matches)
);
INSERT INTO Similar_genres(genre_code, genre_matches) VALUES 
	(0,0), (0,8), (0,3), (0,7), (0,2),
	(1,1), (1,2), (1,5),
	(2,2), (2,1),
	(3,3), (3,0), (3,8), (3,2),
	(4,4), (4,0), (4,8),
	(5,5), (5,1),
	(6,0), (6,1), (6,2), (6,3), (6,4), (6,5), (6,6), (6,7), (6,8),
	(7,7), (7,8),
	(8,8), (8,0), (8,3)
;
Select * from Similar_genres;
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
		, ABS(( Input_album.avg_danceability - Other_album.avg_danceability) * 5)
			+ ABS(( Input_album.avg_energy - Other_album.avg_energy) * 5)
			+ ABS(( Input_album.avg_loudness - Other_album.avg_loudness) * 0.0157 * 5)
			+ ABS(( Input_album.avg_acousticness - Other_album.avg_acousticness) * 5)
			+ ABS(( Input_album.avg_speechiness - Other_album.avg_speechiness) * 5)
			+ ABS(( Input_album.avg_instrumentalness - Other_album.avg_instrumentalness) * 5)
			+ ABS(( Input_album.avg_liveness - Other_album.avg_liveness) * 5)
			+ ABS(( Input_album.avg_tempo - Other_album.avg_tempo ) * 0.0041 * 5)
			+ ABS(( Input_album.avg_valence - Other_album.avg_valence ) * 5)
			+ ABS(( Input_album.avg_duration - Other_album.avg_duration ) /5000000 * 5)
			+ ABS(( Input_album.album_release_year - Other_album.album_release_year)* 0.0145 * 5)
			+ ABS(( Input_album.album_critic_score - Other_album.album_critic_score) * 0.01 * 5)
			+ ABS(( Input_album.album_user_score - Other_album.album_user_score) * 0.01 * 5)
			+ CASE WHEN (Input_album.artist_id = Other_album.artist_id) THEN -0.1 * 5 ELSE 0 END
			+ CASE WHEN (Input_album.genre_id = Other_album.genre_id) THEN -0.1 * 5 ELSE 0 END
			+ CASE WHEN (Input_album.record_label_id = Other_album.record_label_id ) THEN -0.1 * 5 ELSE 0 END
			+ CASE WHEN (Input_album.album_format = Other_album.album_format ) THEN -0.1 * 5 ELSE 0 END
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
			FROM Similar_genres
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
DROP TEMPORARY TABLE  Similar_genres;







/* 
Query 11

Identify artist with most similarity to the input artist.
This will be used in our Artist Recommender on the Artist display page.

Input: 	artist_id
Return: artist_name, artist_id, score

NEEDS OPTIMIZATION
*/



/* 11 */

/*
identify artist with most similar average album rating
use album ratings
similarity ratings of songs in album
*/








