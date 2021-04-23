use project;

SELECT * FROM Song LIMIT 20;



/* 
Query 3

Search a song by keyword. This will be used in our Search tab. 
Exact matches are listed first.
Input: 		Keyword to represent song name
Return: 	song_name, song_id, album_name, artist_name, album_release_year
 
Note:	Change Hello (t1.name, song_name) with ${user_keyword} for final report, 
		note that some order by statements have spaces in them.

ADD FUZZY SEARCH
*/


/* 3 slow */
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
ORDER BY 
	(song_name = 'Hello') DESC 
	, (song_name LIKE 'Hello %') 
		OR (song_name LIKE '% Hello') 
		OR (song_name LIKE '% Hello %') DESC
	, length(song_name);
    
    
    
/* 3 fast */
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
) t1 
	LEFT JOIN Album t2 ON t1.album_id = t2.id
	LEFT JOIN Artist t3 ON t2.artist_id = t3.id
ORDER BY 
	(song_name = 'Hello') DESC 
	, (song_name LIKE 'Hello %') 
		OR (song_name LIKE '% Hello') 
		OR (song_name LIKE '% Hello %') DESC
	, length(song_name);
  
  
 
/* 
Query 4

Search for an artist by keyword. Include the number of songs and albums they have. 
This will be used in our Search tab. Exact matches are listed first.
Input: 		Keyword to represent artist name
Return: 	artist_name, artist_id, album_count, song_count
 
Note:	Change Michael (t3.name, artist) with ${user_keyword} for final report,
		note that some order by statements have spaces in them.

ADD FUZZY SEARCH
ADD HIGHEST RATED ALBUM? OR MOST RECENT RECORD LABEL?
NEEDS OPTIMIZATION
CHANGE artist to artist_name
*/
  



/* 4 */
SELECT 
	artist AS artist_name
	, artist_id
	, COUNT(DISTINCT Album) AS album_count
	, COUNT(DISTINCT Song) AS song_count
FROM (
	SELECT
		t3.name AS artist
		, t3.id AS artist_id
		, t2.title AS album
		, t1.name AS song
	FROM Song t1 
		LEFT JOIN Album t2 ON t1.album_id = t2.id
		LEFT JOIN Artist t3 ON t2.artist_id = t3.id
	WHERE t3.name LIKE '%Michael%' 
) x
GROUP BY Artist
ORDER BY 
	(artist LIKE 'Michael %') DESC 
	, (artist LIKE '% Michael') DESC 
	, album_count DESC 
	, song_count DESC;
    
    

/* 
Query 5

Search for an album by keyword. This will be used in our Search tab.
Exact matches are listed first.
Input: 		Keyword to represent album name
Return: 	album_name, album_id, artist_name, album_release_year,
			album_format, record_label_name

Note:	Change Night (t1.title, album_name) with ${user_keyword} for final report, 
		note that some order by statements have spaces in them.
 
ADD FUZZY SEARCH
NEEDS OPTIMIZATION
UPDATE table numbers to match guide
*/


/* 5 */
SELECT
	t1.title AS album_name
	, t1.id AS album_id
	, t2.name AS artist_name
	, t1.release_year AS album_release_year
	, t1.format AS album_format
	, t3.name AS record_label_name
FROM Album t1
	LEFT JOIN Artist t2 ON t1.artist_id = t2.id
	LEFT JOIN  RecordLabel t3 ON t1.record_label_id = t3.id
WHERE t1.title LIKE '%Night%'
ORDER BY 
	(album_name = 'Night') DESC 
	, (album_name LIKE 'Night %') 
		OR (album_name LIKE '% Night') 
		OR (album_name LIKE '% Night %') DESC
	, length(album_name);
    


    
