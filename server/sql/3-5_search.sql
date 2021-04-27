use project;

SELECT * FROM Album LIMIT 20;


/* 
Query 3
Search a song by keyword. This will be used in our Search tab. 
Exact matches are listed first, then LIKE matches, then fuzzy matches.
Input: 		Keyword to represent song name
Return: 	song_name, song_id, album_name, artist_name, album_release_year
 
Note:	Change "Hello" (t1.name, song_name) with ${user_keyword} for final report, 
	note that some ORDER BY statements have spaces in them.
*/

/* 3 SLOW */
SELECT
	t1.name AS song_name
	, t1.id AS song_id
	, t2.title AS album_name
	, t3.name AS artist_name
	, t2.release_year AS album_release_year
FROM Song t1 
	LEFT JOIN Album t2 ON t1.album_id = t2.id
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
WHERE t1.name LIKE '%Hello%'
	OR  t1.name IN (
		SELECT name
		FROM Song
        WHERE SOUNDEX(name) = SOUNDEX('Hello')
	) 
ORDER BY 
	(song_name = 'Hello') DESC 
	, (song_name LIKE 'Hello %') 
		OR (song_name LIKE '% Hello') 
		OR (song_name LIKE '% Hello %') DESC
	, (song_name LIKE '%Hello%') DESC
	, length(song_name);
    
    
    
/* 3 FAST
JOINs instead of LEFT JOIN, 
pushing LIKE and SOUNDEX selection before JOIN 
Replaced SOUNDEX subquery so that SOUNDEX comparison is only performed for one row */
SELECT
	t1.name AS song_name
	, t1.id AS song_id
	, t2.title AS album_name
	, t3.name AS artist_name
	, t2.release_year AS album_release_year
FROM (
	SELECT
		album_id
		, name
		, id 
	FROM Song
	WHERE Song.name LIKE '%Hello%'
		OR SOUNDEX(Song.name) = SOUNDEX('Hello')
) t1 
    JOIN Album t2 ON t1.album_id = t2.id
    JOIN Artist t3 ON t2.artist_id = t3.id
ORDER BY 
	(song_name = 'Hello') DESC 
	, (song_name LIKE 'Hello %') 
		OR (song_name LIKE '% Hello') 
		OR (song_name LIKE '% Hello %') DESC
	, (song_name LIKE '%Hello%') DESC
	, length(song_name);
  
  
 
/* 
Query 4
Search for an artist by keyword. Include the number of songs and albums they have. 
This will be used in our Search tab.
Exact matches are listed first, then LIKE matches, then fuzzy matches.
Input: 		Keyword to represent artist name
Return: 	artist_name, artist_id, album_count, song_count,
		most_frequent_genre_name
 
Note:	Change "Michael" (t3.name, artist) with ${user_keyword} for final report,
	note that some ORDER BY statements have spaces in them.
*/

/* 4 SLOW */
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
		FROM Song t1 
			LEFT JOIN Album t2 ON t1.album_id = t2.id
			LEFT JOIN Artist t3 ON t2.artist_id = t3.id
		WHERE t3.name LIKE '%Michael%' 
			OR  t3.name IN (
				SELECT name
				FROM Artist
				WHERE SOUNDEX(name) = SOUNDEX('Michael')
			) 
	) x
	GROUP BY artist_name
), 
most_frequent_genre AS (
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
			) x
			GROUP BY artist_id, genre_id
			ORDER BY artist_id
		) y
	) z
	WHERE score_rank < 2
)
SELECT 
	similar_artists.artist_name
	, similar_artists.artist_id
	, similar_artists.album_count
	, similar_artists.song_count
	, t5.name AS most_frequent_genre_name
FROM similar_artists 
	LEFT JOIN most_frequent_genre ON similar_artists.artist_id = most_frequent_genre.artist_id
	LEFT JOIN Genre t5 ON most_frequent_genre.genre_id = t5.id
ORDER BY 
		(artist_name LIKE 'Michael') DESC 
		, (artist_name LIKE 'Michael %') DESC 
		, (artist_name LIKE '% Michael') DESC
		, (artist_name LIKE '%Michael%') DESC
		, album_count DESC 
		, song_count DESC;


/* 4 FAST 
JOINs instead of LEFT JOIN, 
pushing LIKE and SOUNDEX selection before JOIN,
Replaced SOUNDEX subquery so that SOUNDEX comparison is only performed for one row
narrowing most_frequent_genre table to one row (based on artist_id) before JOIN
use smaller dataset as the outer loop in joins */
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
            WHERE name LIKE '%Michael%' 
		OR SOUNDEX(name) = SOUNDEX('Michael')
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
	(artist_name LIKE 'Michael') DESC 
	, (artist_name LIKE 'Michael %') DESC 
	, (artist_name LIKE '% Michael') DESC
	, (artist_name LIKE '%Michael%') DESC
	, album_count DESC 
	, song_count DESC;


/* 
Query 5
Search for an album by keyword. This will be used in our Search tab.
Exact matches are listed first, then LIKE matches, then fuzzy matches.
Input: 		Keyword to represent album name
Return: 	album_name, album_id, artist_name, album_release_year,
			album_format, record_label_name
Note:	Change "Night" (t1.title, album_name) with ${user_keyword} for final report, 
	note that some ORDER BY statements have spaces in them.
*/



/* 5 SLOW*/
SELECT
	t2.title AS album_name
	, t2.id AS album_id
	, t3.name AS artist_name
	, t2.release_year AS album_release_year
	, t2.format AS album_format
	, t4.name AS record_label_name
FROM Album t2
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	LEFT JOIN  RecordLabel t4 ON t2.record_label_id = t4.id
WHERE t2.title LIKE '%Night%' 
	OR  t2.title IN (
		SELECT title
		FROM Album
		WHERE SOUNDEX(title) = SOUNDEX('Night')
	) 
ORDER BY 
	(album_name = 'Night') DESC 
	, (album_name LIKE 'Night %') 
		OR (album_name LIKE '% Night') 
		OR (album_name LIKE '% Night %') DESC
	, (album_name LIKE '%Night%')  DESC
	, length(album_name);
    
    
    
    
/* 5 FAST
JOINs instead of LEFT JOIN, 
pushing LIKE and SOUNDEX selection before JOIN,
Replaced SOUNDEX subquery so that SOUNDEX comparison is only performed for one row
use smaller dataset as the outer loop in joins */
SELECT
	t2.title AS album_name
	, t2.id AS album_id
	, t3.name AS artist_name
	, t2.release_year AS album_release_year
	, t2.format AS album_format
	, t4.name AS record_label_name
FROM (
	SELECT 
	title
        , id
        , release_year
        , format
        , record_label_id
        , artist_id
    FROM Album 
    WHERE title LIKE '%Night%'
	OR SOUNDEX(title) = SOUNDEX('Night')
)t2
	JOIN RecordLabel t4 ON t2.record_label_id = t4.id
	JOIN Artist t3 ON t2.artist_id = t3.id
ORDER BY 
	(album_name = 'Night') DESC 
	, (album_name LIKE 'Night %') 
		OR (album_name LIKE '% Night') 
		OR (album_name LIKE '% Night %') DESC
	, (album_name LIKE '%Night%')  DESC
	, length(album_name);
