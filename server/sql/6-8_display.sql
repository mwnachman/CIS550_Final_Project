use project_prod;

SELECT * FROM PitchforkReviews LIMIT 100;


/* 
Query 6A

Search an artist and display all of their albums,
ordered by popularity (AOTY User Score), limit 50. 
This will be used for the Artist display page.
Input: 		artist_id = "3fMbdgg4jU18AjLCKBhRSm" line 61
Return: 	artist_name, album_id, album_name, album_format,
		release_year, aoty_critic_score, aoty_user_score,
		num_aoty_critic_reviews, num_aoty_user_reviews,
		record_label_name, genre_name
*/

/* 6A SLOW*/
SELECT
	t3.name AS artist_name
	, t2.id AS album_id
	, t2.title AS album_name
	, t2.format AS album_format
	, t2.release_year AS release_year
	, t2.aoty_critic_score*0.1 AS aoty_critic_score
	, t2.aoty_user_score*0.1 AS aoty_user_score
	, t2.num_aoty_critic_reviews AS num_aoty_critic_reviews
	, t2.num_aoty_user_reviews AS num_aoty_user_reviews
	, t4.name AS record_label_name
	, t5.name AS genre_name
FROM Album t2
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	LEFT JOIN RecordLabel t4 ON  t2.record_label_id = t4.id
	LEFT JOIN Genre t5 ON t2.genre_id = t5.id
WHERE t3.id = '3fMbdgg4jU18AjLCKBhRSm'
ORDER BY t2.aoty_user_score DESC
LIMIT 50;


/* 6A FAST
JOINs instead of LEFT JOIN, 
pushing selection before JOIN,
use smaller dataset as the outer loop in joins */

SELECT
	t3.name AS artist_name
	, t2.id AS album_id
	, t2.title AS album_name
	, t2.format AS album_format
	, t2.release_year AS release_year
	, t2.aoty_critic_score*0.1 AS aoty_critic_score
	, t2.aoty_user_score*0.1 AS aoty_user_score
	, t2.num_aoty_critic_reviews AS num_aoty_critic_reviews
	, t2.num_aoty_user_reviews AS num_aoty_user_reviews
	, t4.name AS record_label_name
	, t5.name AS genre_name
FROM (
	SELECT name, id
	FROM Artist
	WHERE id = '3fMbdgg4jU18AjLCKBhRSm'
) t3
	JOIN Album t2 ON t2.artist_id = t3.id
	JOIN Genre t5 ON t2.genre_id = t5.id
	JOIN RecordLabel t4 ON  t2.record_label_id = t4.id
ORDER BY t2.aoty_user_score DESC
LIMIT 50;


/* 
Query 6B

Search an artist and display summary stats for all of their songs
Average Stats are adjusted to a 10 point scale. 
This will be used for the Artist display page.
Input: 		artist_id = "3fMbdgg4jU18AjLCKBhRSm" line 140
Return: 	avg_danceability (score 0-10)
		avg_energy (score 0-10)
		avg_acousticness (score 0-10)
		avg_speechiness (score 0-10)
		avg_instrumentalness (score 0-10)
		avg_liveness (score 0-10)
		avg_valence (score 0-10)
		avg_loudness_db (decibels)
		avg_tempo_bpm (beats per minute)
		avg_duration_ms (milliseconds)
		avg_album_critic_score (score 0-10)
		avg_album_user_score (score 0-10)
		most_tracks_in_album
		most_recent_release_year
*/


/* 6B SLOW */
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
FROM 
	Song t1 
	LEFT JOIN Album t2 ON t1.album_id = t2.id
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
WHERE t3.id = '3fMbdgg4jU18AjLCKBhRSm';



/* 6B FAST 
JOINs instead of LEFT JOIN, 
pushing selection before JOIN,
use smaller dataset as the outer loop in joins */
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
	WHERE id = '3fMbdgg4jU18AjLCKBhRSm'
) t3 
	JOIN Album t2 ON t2.artist_id = t3.id
	JOIN Song t1 ON t1.album_id = t2.id;
 

 
 
/* 
Query 7A

Search an album and display all songs in the album,
ordered by track number.
This will be used for the Album display page.
Input: 		album_id = "0oX4SealMgNXrvRDhqqOKg" line 186
Return: 	disc_number, track_number, song_name, song_id,
		total_duration_ms, danceability, energy, song_key,
		loudness_db, acousticness, speechiness, 
		instrumentalness, liveness, valence, tempo_bpm, 
		major_minor_mode, time_signature
*/


/* 7A No optimization needed */
SELECT 
	t1.disc_number AS disc_number
	, t1.track_number AS track_number
	, t1.name AS song_name
	, t1.id AS song_id
	, t1.duration_ms AS total_duration_ms
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
FROM Song t1
WHERE album_id = '0oX4SealMgNXrvRDhqqOKg'
ORDER BY disc_number, track_number;
 


/* 
Query 7B
Search an album and dislay album information 
and summary stats for all of the songs in the album.
This will be used for the Album display page.
Input: 		album_id = "0oX4SealMgNXrvRDhqqOKg" line 280
Return: 	album_name, album_id, artist_name,
		artist_id, album_release_year, 
		album_format, record_label_name, genre_name,
		album_critic_score, album_user_score,
		num_aoty_critic_reviews, num_aoty_user_reviews
		avg_danceability (score 0-10),
		avg_energy (score 0-10),
		avg_acousticness (score 0-10),
		avg_speechiness (score 0-10),
		avg_instrumentalness (score 0-10),
		avg_liveness (score 0-10),
		avg_valence (score 0-10),
		avg_loudness_db (decibels),
		avg_tempo_bpm (beats per minute),
		avg_duration_ms (milliseconds),
		review_url
*/


/* 7B SLOW */
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
FROM  Song t1
	LEFT JOIN Album t2 ON t1.album_id = t2.id
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	LEFT JOIN  RecordLabel t4 ON t2.record_label_id = t4.id
	LEFT JOIN Genre t5 ON t2.genre_id = t5.id
    LEFT JOIN (
		SELECT album_id, url
		FROM PitchforkReviews 
		GROUP BY album_id
	) t6 ON t2.id = t6.album_id
WHERE t2.id = '2sfLsbSsDm780Llr9NWHQz';



/* 7B FAST 
JOINs instead of LEFT JOIN, 
pushing selection before JOIN,
use smaller dataset as the outer loop in joins */
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
	WHERE id = '2sfLsbSsDm780Llr9NWHQz'
) t2 
	LEFT JOIN (
		SELECT album_id, url
		FROM PitchforkReviews 
		WHERE album_id = '2sfLsbSsDm780Llr9NWHQz'
		ORDER BY score DESC
		LIMIT 1
	) t6 ON t2.id = t6.album_id
	JOIN Genre t5 ON t2.genre_id = t5.id
	JOIN RecordLabel t4 ON t2.record_label_id = t4.id
	JOIN Artist t3 ON t2.artist_id = t3.id
	JOIN Song t1 ON t1.album_id = t2.id;

    



/* 
Query 8

Search a song and display statistics and relevant information. 
This will be used for the Song display page.
Input: 		song_id = "7EsjkelQuoUlJXEw7SeVV4" line 383
Return: 	song_name, duration_ms, danceability,
		energy, song_key, loudness_db, acousticness,
		speechiness, instrumentalness, liveness,
		valence, tempo_bpm, major_minor_modem time_signature,
		disc_number, track_number, album_name, album_id,
		artist_name, artist_id, album_release_year,
		album_format, record_label_name, genre_name,
		album_critic_score, album_user_score,
		album_num_critic_reviews, album_num_user_reviews
*/
 
/* Query 8 SLOW*/
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
FROM  Song t1
	LEFT JOIN Album t2 ON t1.album_id = t2.id
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	LEFT JOIN  RecordLabel t4 ON t2.record_label_id = t4.id
	LEFT JOIN Genre t5 ON t2.genre_id = t5.id
WHERE t1.id='7EsjkelQuoUlJXEw7SeVV4';


/* Query 8 FAST
JOINs instead of LEFT JOIN, 
pushing selection before JOIN,
use smaller dataset as the outer loop in joins */
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
	WHERE id ='7EsjkelQuoUlJXEw7SeVV4'
) t1
	JOIN Album t2 ON t1.album_id = t2.id
	JOIN Genre t5 ON t2.genre_id = t5.id
	JOIN  RecordLabel t4 ON t2.record_label_id = t4.id
	JOIN Artist t3 ON t2.artist_id = t3.id
;
