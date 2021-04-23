use project;

SELECT * FROM Song LIMIT 20;


/* 
Query 6

Search an artist and display top 10 most popular albums by AOTY User Score. 
This will be used for the Artist display page.
Input: 		artist_id
Return: 	DISPLAY A LOT OF INFO FOR PAGE, TOP ALBUM

Note: Change ??? (artist_id) to ${artist_id} for final report.


UPDATE DESCRIPTION
NEEDS OPTIMIZATION
UPDATE TABLE NUMBERS
CHANGE INPUT TO ARTIST ID
NEED TO DECIDE WHAT TO RETURN AND WHAT NEEDS TO BE DISPLAYED ON THIS PAGE
*/


/* 6 */
SELECT
	t1.name AS Artist
	, t2.title AS Album
	, t2.release_year AS Year
	, t3.name AS Genre
	, t2.aoty_critic_score AS AOTY_Critic_Score
	, t2.aoty_user_score AS AOTY_User_Score
FROM Artist t1 
	LEFT JOIN Album t2 ON t1.id = t2.artist_id
	LEFT JOIN Genre t3 ON t2.genre_id = t3.id
WHERE t1.name LIKE '%${user_keyword}% '
ORDER BY t2.aoty_user_score DESC
LIMIT 10;
 
 
/* 
Query 7

Search an album and display all songs in the album.
This will be used for the Album display page.
Input: 		album_id
Return: 	DISPLAY A LOT OF INFO FOR PAGE

Note: Change ??? (album_id) to ${album_id} for final report.

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

Note: Change ??? (song_id) to ${song_id} for final report.

NEEDS OPTIMIZATION
UPDATE TABLE NUMBERS
CHANGE INPUT TO ARTIST ID
NEED TO DECIDE WHAT TO RETURN AND WHAT NEEDS TO BE DISPLAYED ON THIS PAGE
*/
 
/* 8 */
 
