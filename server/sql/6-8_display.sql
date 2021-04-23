use project;

SELECT * FROM Song LIMIT 20;


/* 
Query 6A

Search an artist and display all of their albums,
ordered by popularity (AOTY User Score), limit 50. 
This will be used for the Artist display page.
Input: 		artist_id
Return: 	artist_name, album_id, album_name, album_format,
			release_year, aoty_critic_score, aoty_user_score,
			num_aoty_critic_reviews, num_aoty_user_reviews,
            record_label_name, genre_name

Note: Change "3fMbdgg4jU18AjLCKBhRSm" (artist_id) to ${artist_id} for final report.

NEEDS OPTIMIZATION
*/


/* 6A */
SELECT
	t3.name AS artist_name
    , t2.id AS album_id
    , t2.title AS album_name
    , t2.format AS album_format
    , t2.release_year AS release_year
    , t2.aoty_critic_score*0.1 AS aoty_critic_score
	, t2.aoty_user_score*0.1 AS aoty_user_score
	, t2.num_atoy_critic_reviews AS num_aoty_critic_reviews
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
 
 
/* 
Query 6B

Search an artist and display summary stats for all of their songs
Average Stats are adjusted to a 10 point scale. 
This will be used for the Artist display page.
Input: 		artist_id
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

Note: Change "3fMbdgg4jU18AjLCKBhRSm" (artist_id) to ${artist_id} for final report.

NEEDS OPTIMIZATION
*/


/* 6B */
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
 

 
 
/* 
Query 7

Search an album and display all songs in the album.
This will be used for the Album display page.
Input: 		album_id
Return: 	DISPLAY A LOT OF INFO FOR PAGE

Note: Change "???"" (album_id) to ${album_id} for final report.

UPDATE DESCRIPTION
NEEDS OPTIMIZATION
UPDATE TABLE NUMBERS
CHANGE INPUT TO ARTIST ID
NEED TO DECIDE WHAT TO RETURN AND WHAT NEEDS TO BE DISPLAYED ON THIS PAGE
*/


/* 7 */
SELECT 
	track_number as Track_Number
   	, FLOOR(duration_ms/60000) AS time_minutes
  	, ROUND((duration_ms/60000 % 1)*60) AS time_seconds
    	, name AS Name
   	, danceability as Danceability
	, energy as Energy
	, loudness as Loudness
	, acousticness as Acousticness
	, speechiness as Speechiness
	, instrumentalness as Instrumentalness
	, liveness as Liveness
	, tempo as Tempo
	, explicit as Explicit
FROM Song
WHERE album_id IN (
	SELECT id
	FROM Album
	WHERE title = '${user_keyword}'
) 
ORDER BY track_number;
 
 


/* 
Query 8

Search a song and display [...]. 
This will be used for the Song display page.
Input: 		song_id
Return: 	DISPLAY A LOT OF INFO FOR PAGE

Note: Change "???" (song_id) to ${song_id} for final report.

NEEDS OPTIMIZATION
NEED TO DECIDE WHAT TO RETURN AND WHAT NEEDS TO BE DISPLAYED ON THIS PAGE
*/
 
/* 8 */
 
