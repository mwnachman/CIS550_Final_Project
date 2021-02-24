CREATE DATABASE project;

USE project;

CREATE TABLE Artist (
	id      CHAR(22),
	name    VARCHAR(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Album (
    id              CHAR(22),
	title           VARCHAR(255) NOT NULL,
	format          VARCHAR(5) NOT NULL,
--	release_day     ,
--	release_month   ,
	release_year    INT(4),
    PRIMARY KEY (id) 
);

CREATE TABLE ArtistToAlbumJoin (
	artist_id   CHAR(22),
	album_id    CHAR(22),
	FOREIGN KEY (artist_id) REFERENCES Artist (id),
	FOREIGN KEY (album_id) REFERENCES Album (id)
);

--https://developer.spotify.com/documentation/web-api/reference/#category-tracks
CREATE TABLE Song (
	id                  CHAR(22),
    name                VARCHAR(255) NOT NULL,
	duration_ms         INT(7) NOT NULL,
	acousticness        DECIMAL(6,6) NOT NULL,
	liveness            DECIMAL(4,4) NOT NULL,
	instrumentalness    DECIMAL(6,6) NOT NULL,
    loudness            DECIMAL(3,3) NOT NULL,
    speechiness         DECIMAL(4,4) NOT NULL,
	energy              DECIMAL(3,3) NOT NULL,
	mode                BOOL NOT NULL,
	danceability        DECIMAL(3,3) NOT NULL,
	song_key            INT(2) NOT NULL,
    tempo               DECIMAL(3,3) NOT NULL,
	valence             DECIMAL(3,3) NOT NULL,
	explicit            BOOL NOT NULL,
    time_signature      DECIMAL(1,1) NOT NULL,
	release_date        DATE NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE AlbumToSongJoin (
	album_id        CHAR(22),
	track_id        CHAR(22),
	track_number    INT(2) NOT NULL,
	disc_number     INT(2) NOT NULL,
	FOREIGN KEY (album_id) REFERENCES Album (id),
    FOREIGN KEY (track_id) REFERENCES Song (id)
);

CREATE TABLE Genre (
	name    VARCHAR(255),
	PRIMARY KEY (name)
);

CREATE TABLE AlbumToGenreJoin (
	genre       VARCHAR(255),
	album_id    CHAR(22),
    FOREIGN KEY (genre) REFERENCES Genre (name),
    FOREIGN KEY (album_id) REFERENCES Album (id)
);

CREATE TABLE RecordLabel (
	name    VARCHAR(255),
	PRIMARY KEY (name) 
);

CREATE TABLE AlbumToRecordlabelJoin (
	album_id        CHAR(22),
	record_label    CHAR(22),
	FOREIGN KEY (album_id) REFERENCES Album (id),
	FOREIGN KEY (record_label) REFERENCES RecordLabel (name)
);

CREATE TABLE AOTYRatings (
	id                      INT(7),
	aoty_critic_score       INT(3) NOT NULL,
	aoty_user_score         INT(3) NOT NULL,
	num_atoy_critic_reviews INT(4) NOT NULL,
	num_aoty_user_reviews   INT(4) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE AlbumToRatingsJoin (
    album_id    CHAR(22),
    rating_id   INT(7),
    FOREIGN KEY (album_id) REFERENCES Album (id),
    FOREIGN KEY (rating_id) REFERENCES AOTYRatings (id)
);

CREATE TABLE PitchforkReviews (
    id              INT(5),
    url             VARCHAR(255) NOT NULL,
    score           FLOAT(1,1) NOT NULL,
    best_new_music  BOOL NOT NULL,
    pub_date        DATE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE AlbumToPitchforkRatingsJoin (
    review_id    INT(5),
    album_id     CHAR(22),
    FOREIGN KEY (review_id) REFERENCES PitchforkReviews (id),
    FOREIGN KEY (album_id) REFERENCES Album (id)
);

CREATE TABLE Author (
    id      INT(5),
    name    VARCHAR(255),
    type    VARCHAR(100),
    PRIMARY KEY (id)
);

CREATE TABLE AuthorToPitchforkRatingsJoin (
    review_id   INT(5),
    author_id   INT(5),
    FOREIGN KEY (review_id) REFERENCES PitchforkReviews (id),
    FOREIGN KEY (author_id) REFERENCES Author (id)
);




DROP DATABASE project;