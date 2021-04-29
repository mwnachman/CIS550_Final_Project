use project;

SELECT * FROM Song LIMIT 20;


/* 
Query 0

Randomly generate 5 album entries in a selected genre. 
This is for the Homepage.
Input: 		Integer representing genre code (0-8)
Return: 	song_name, song_id, artist_name, artist_id, album_name,
		album_id, album_release_year, album_format, record_label_name

Note: Change "1" (genre_id) to ${genre_id} for final report.
*/

/* Query 0 SLOW */
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
	Song t1 
	LEFT JOIN Album t2 ON t1.album_id = t2.id
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id 
	LEFT JOIN RecordLabel t4 ON t2.record_label_id = t4.id
	LEFT JOIN Genre t5 ON t2.genre_id = t5.id
WHERE t2.genre_id = 1
ORDER BY RAND()
LIMIT 5;
 

/* Query 0 FAST: 
JOINs instead of LEFT JOIN, 
elmiminate Genre from Join, 
use smaller dataset as the outer loop in joins */
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
WHERE t2.genre_id = 1
ORDER BY RAND()
LIMIT 5;




/* 
Query 1

Get the top 5 highly rated albums ranked by AOTY User Score & AOTY Album Score. 
Input is a specific genre. 
This will be used for the Browsing tab.
Input: 		Integer representing genre code (0-8)
Return: 	album_name, album_id, artist_name, artist_id, 
		album_release_year, album_format, record_label_name,
		album_critic_score (0-10), album_user_score(0-10)

Note: Change "1" (genre_id) to ${genre_id} for final report.
*/

/* Query 1 SLOW*/
SELECT 
	t2.title AS album_name
	, t2.id AS album_id
	, t3.name AS artist_name
	, t2.artist_id
	, t2.release_year AS album_release_year
	, t2.format AS album_format
	, t4.name AS record_label_name
	, t2.aoty_critic_score*.1 AS album_critic_score
	, t2.aoty_user_score*.1 AS album_user_score
FROM 
	Album t2 
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	LEFT JOIN Genre t5 ON t2.genre_id = t5.id
	LEFT JOIN RecordLabel t4 ON t2.record_label_id = t4.id
WHERE genre_id = 1 
	AND num_aoty_user_reviews >= 15
    AND num_aoty_critic_reviews >= 2
ORDER BY (t2.aoty_user_score + t2.aoty_critic_score)/2 DESC
LIMIT 50;


/* Query 1 FAST: 
JOINs instead of LEFT JOIN, 
elmiminate Genre from JOIN,  
use smaller dataset as the outer loop in joins*/
SELECT
	t2.title AS album_name
	, t2.id AS album_id
	, t3.name AS artist_name
	, t2.artist_id
	, t2.release_year AS album_release_year
	, t2.format AS album_format
	, t4.name AS record_label_name
	, t2.aoty_critic_score*.1 AS album_critic_score
	, t2.aoty_user_score*.1 AS album_user_score
FROM
	RecordLabel t4 
	JOIN Album t2 ON t2.record_label_id = t4.id
	JOIN Artist t3 ON t2.artist_id = t3.id 
WHERE genre_id = 1 
	AND num_aoty_user_reviews >= 15
    AND num_aoty_critic_reviews >= 2
ORDER BY (t2.aoty_user_score + t2.aoty_critic_score)/2 DESC
LIMIT 50;


/* 
Query 2

Get the top 5 danceability albums from each year. 
Input is a specific genre. 
This will be used for the Browsing tab.
Input: 		Integer representing genre code (0-8)
Return: 	album_name, album_id, artist_name, artist_id, 
		album_release_year, album_format, record_label_name,
		album_critic_score (0-10), album_user_score(0-10),
		avg_danceability
        
Note: 	Change "2" (genre_id) to ${genre_id} for final report.
Note: 	We can interchange "danceability" with "speechiness", "energy", "tempo", 
	"loudness", "liveness", "acousticness", "instrumentalness",
        "valence", or "duration_ms"
*/

/* Query 2 SLOW*/
SELECT *
FROM (
	SELECT 
		 album_name
		, album_id
		, artist_name
		, artist_id
		, album_release_year
		, album_format
		, record_label_name
		, album_critic_score
		, album_user_score
		, genre_id
		, avg_danceability
		, ROW_NUMBER() OVER (PARTITION BY album_release_year ORDER BY avg_danceability DESC) AS score_rank
	FROM (
		SELECT 
			album_release_year
			, album_name
			, album_id
			, artist_name
			, artist_id
			, album_format
			, record_label_name
			, album_critic_score
			, album_user_score
			, genre_id
			, AVG(danceability) AS avg_danceability
		FROM (
			SELECT 
				t2.release_year AS album_release_year
				, t2.title AS album_name
				, t2.id AS album_id
				, t3.name AS artist_name
				, t2.artist_id
				, t2.format AS album_format
				, t4.name AS record_label_name
				, t2.aoty_critic_score*.1 AS album_critic_score
				, t2.aoty_user_score*.1 AS album_user_score
				, t1.danceability AS danceability
				, t2.genre_id AS genre_id
			FROM 
				Song t1
				LEFT JOIN Album t2 ON t1.album_id = t2.id
				LEFT JOIN Artist t3 ON t2.artist_id = t3.id
				LEFT JOIN  RecordLabel t4 ON t2.record_label_id = t4.id
				LEFT JOIN Genre t5 ON t2.genre_id = t5.id
		)x
		GROUP BY album_id
        	HAVING x.genre_id = 2
	)y
)z
WHERE score_rank <= 5
ORDER BY album_release_year, score_rank;



/* Query 2 FAST: 
JOINs instead of LEFT JOIN, 
elmiminate Genre from JOIN, 
pushing "genre_id = 1" selection before JOIN,
deleting top 5 per year restriction,
use smaller dataset as the outer loop in joins*/
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
	, AVG(t1.danceability) AS avg_danceability
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
	WHERE genre_id = 2
)t2
	JOIN RecordLabel t4 ON t2.record_label_id = t4.id
	JOIN Artist t3 ON t2.artist_id = t3.id
	JOIN Song t1 ON t1.album_id = t2.id
GROUP BY album_id
ORDER BY avg_danceability DESC
LIMIT 50;
