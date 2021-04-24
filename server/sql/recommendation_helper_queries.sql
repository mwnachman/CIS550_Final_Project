use project;

SELECT * FROM Song LIMIT 20;


/* Find min/max values used for analysis*/
SELECT 
	MAX(time_signature), 
	MIN(time_signature),
	MAX(duration_ms), 
	MIN(duration_ms),
	MAX(song_key), 
	MIN(song_key),
	MAX(danceability), 
	MIN(danceability), 
	MAX(energy), 
	MIN(energy), 
	MAX(loudness), 
	MIN(loudness), 
	MAX(acousticness), 
	MIN(acousticness), 
	MAX(speechiness), 
	MIN(speechiness), 
	MAX(instrumentalness), 
	MIN(instrumentalness), 
	MAX(liveness), 
	MIN(liveness), 
	MAX(tempo), 
	MIN(tempo),
	MAX(valence), 
	MIN(valence)
FROM Song;
SELECT 
	MAX(release_year), 
	MIN(release_year),
	MAX(aoty_critic_score), 
	MIN(aoty_critic_score),
	MAX(aoty_user_score), 
	MIN(aoty_user_score)
FROM Album;
 


/* Manipulating algorithm values (all user inputs = 5) */
SELECT 
	t1.id AS song_id
	, t1.name AS song_name
	, ABS(( Input_song.danceability - t1.danceability) * 5) AS danceability_diff
	, ABS(( Input_song.energy - t1.energy) * 5)  AS energy_diff
	, ABS(( Input_song.loudness - t1.loudness) * 0.0157 * 5) AS loudness_diff
	, ABS(( Input_song.acousticness - t1.acousticness) * 5) AS acousticness_diff
	, ABS(( Input_song.speechiness - t1.speechiness) * 5) AS speechiness_diff
	, ABS(( Input_song.instrumentalness - t1.instrumentalness) * 5) AS instrumentalness_diff
	, ABS(( Input_song.liveness - t1.liveness) * 5)  AS liveness_diff
	, ABS(( Input_song.tempo - t1.tempo ) * 0.0041 * 5)  AS tempo_diff
	, ABS(( Input_song.valence - t1.valence ) * 5)  AS valence_diff
	, ABS(( Input_song.album_release_year - t2.release_year) * 0.0145 * 5) AS release_year_diff
	, ABS(( Input_song.album_aoty_critic_score - t2.aoty_critic_score) * 0.01 * 5) AS aoty_critic_score_diff
	, ABS(( Input_song.album_aoty_user_score - t2.aoty_user_score) * 0.01 * 5) AS aoty_critic_user_diff
	, CASE WHEN (Input_song.artist_id = t2.artist_id) THEN -0.1 * 5 ELSE 0 END AS same_artist_adjustment
	, CASE WHEN (Input_song.album_id = t1.album_id) THEN -0.1 * 5 ELSE 0 END AS same_album_adjustment
	, CASE WHEN (Input_song.genre_id = t2.genre_id) THEN -0.1 * 5 ELSE 0 END AS same_genre_adjustment
	, CASE WHEN (Input_song.record_label_id = t2.record_label_id ) THEN -0.1 * 5 ELSE 0 END AS same_record_label_adjustment
	, CASE WHEN (Input_song.album_format = t2.format ) THEN -0.1 * 5 ELSE 0 END AS same_album_format_adjustment
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
WHERE t1.id != Input_song.song_id
LIMIT 50;



