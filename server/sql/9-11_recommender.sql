use project;

SELECT * FROM Song LIMIT 20;


/* 
Query 9

Identify songs with most similar attributes of the input song. 
User inputs determine the weight that the algorithm assigns to specific song traits. 
User inputs should be numbers (not necessarily integers) between 0 and 10.
This will be used in our Song Reccomender.
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

Identify artist with most similarity.
This will be used in our Reccomender tab. 
Input is an artist
Input: 	
Return: 	

NEEDS MORE OPTIMIZATION
*/



/* 10 fast */


/* 10 slow */






/* 
Query 11

Identify album with most similarity. 
This will be used in our Reccomender tab. 
Input is an album.
Input: 	
Return: 	

NEEDS MORE OPTIMIZATION
*/



/* 11 fast */


/* 11 slow */

