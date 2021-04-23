use project;

SELECT * FROM Song LIMIT 20;


/* 
Query 0

Randomly generate 5 song/album/artist entries in a selected genre. 
This is for the Homepage.
Input: 		Integer representing genre code (0-8)
Return: 	song_name, song_id, artist_name, artist_id, album_name,
		album_id, album_release_year, album_format, record_label_name

Note: Change "2" (genre_id) to ${genre_id} for final report.

NEEDS OPTIMIZATION
*/



/* 0 */
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
WHERE genre_id = 2
ORDER BY RAND()
LIMIT 5;
 





/* 
Query 1

Get the top 5 popular albums from each year ranked by AOTY User Score. 
Input is a specific genre. 
This will be used for the Browsing by Popularity tab.
Input: 		Integer representing genre code (0-8)
Return: 	album_release_year, score_rank, album_name, album_id,
		artist_name, artist_id, album_format, record_label_name,
		album_critic_score (0-10), album_user_score(0-10)

Note: Change "2" (genre_id) to ${genre_id} for final report.

NEEDS OPTIMIZATION
*/



/* Query 1  updated */
SELECT *
FROM (
	SELECT 
		t2.release_year AS album_release_year
		, ROW_NUMBER() OVER (PARTITION BY t2.release_year ORDER BY t2.aoty_user_score DESC) AS score_rank
		, t2.title AS album_name
		, t2.id AS album_id
		, t3.name AS artist_name
		, t2.artist_id
		, t2.format AS album_format
		, t4.name AS record_label_name
        , t2.aoty_critic_score*.1 AS album_critic_score
		, t2.aoty_user_score*.1 AS album_user_score
	FROM 
		Album t2 
		JOIN Artist t3 ON t2.artist_id = t3.id
		JOIN RecordLabel t4 ON t2.record_label_id = t4.id
		JOIN Genre t5 ON t2.genre_id = t5.id
	WHERE genre_id = 2
) x
WHERE x.score_rank <= 5
ORDER BY album_release_year DESC, score_rank;


    
/* Query 1 andrew version with some added columns 
Previous version, No further optimization */
SELECT *
FROM (
	SELECT 
		t1.release_year
		, t2.id AS genre_id
        , t2.name AS genre_name
		, t1.title AS album
		, ROW_NUMBER() OVER (PARTITION BY t1.release_year ORDER BY t1.aoty_user_score DESC) AS score_rank
FROM Album t1 JOIN Genre t2 ON t1.genre_id = t2.id
) x
WHERE score_rank <= 5
ORDER BY genre_id, release_year, score_rank;





/* 
Query 2

Get the most popular album from each genre 
within a range of years (user input). 
This will be used for the Landing/ Browsing by Popularity tab.
Input:   	Two integers: representing start_year and end_year
Return: 	genre_name, album_name, release_year

Note: Change "1950" and "2020" (release_year) to ${start_year} and ${end_year} for final report.

RETURN MORE INFORMATION?
DELETE THIS QUERY?
*/


/* 2 fast: Selection and Projects are pushed as close to the leaves */
SELECT *
FROM (
	SELECT 
		t2.name AS genre_name
		, t1.title AS album_name
		, t1.release_year
		, ROW_NUMBER() OVER (PARTITION BY t2.name ORDER BY t1.aoty_user_score DESC) AS score_rank
	FROM (
		SELECT
			release_year
			, title
			, aoty_user_score
			, genre_id
		FROM Album
		WHERE release_year BETWEEN 1950 AND 2020
	) t1 JOIN Genre t2 ON t1.genre_id = t2.id
) x
WHERE score_rank = 1;


/* 2 slow */
SELECT *
FROM (
SELECT 
	t1.release_year
	, t2.name AS genre
	, t1.title AS album
	, ROW_NUMBER() OVER (PARTITION BY t2.name ORDER BY t1.aoty_user_score DESC) AS score_rank
FROM Album t1 JOIN Genre t2 ON t1.genre_id = t2.id
) x
WHERE release_year BETWEEN 1950 AND 2020
	AND score_rank = 1;




