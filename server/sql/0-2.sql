use project;

SELECT * FROM Song LIMIT 20;


/* 0 needs optimization */
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
 




/* 1 needs optimization */
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
	FROM 
		Album t2 
		JOIN Genre t5 ON t2.genre_id = t5.id
		JOIN Artist t3 ON t2.artist_id = t3.id
		JOIN RecordLabel t4 ON t2.record_label_id = t4.id
	WHERE genre_id = 2
) x
WHERE x.score_rank <= 5
ORDER BY album_release_year DESC, score_rank;


    
/*1 andrew version with some added columns*/
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


/* 2 fast */
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




