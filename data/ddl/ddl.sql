DROP DATABASE project;
CREATE DATABASE project;

USE project;

CREATE TABLE Artist (
  id      CHAR(22),
  name    VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Genre (
  id      INT,
  name    VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE RecordLabel (
  id      INT,
  name    VARCHAR(255) NOT NULL,
  PRIMARY KEY (id) 
);

CREATE TABLE Album (
  id                      CHAR(22),
  title                   VARCHAR(255) NOT NULL,
  artist_id               CHAR(22) NOT NULL,
  genre_id                INT,
  record_label_id         INT,
  format                  VARCHAR(5) NOT NULL,
  release_year            INT NOT NULL,
  aoty_critic_score       INT NOT NULL,
  aoty_user_score         INT NOT NULL,
  num_atoy_critic_reviews INT NOT NULL,
  num_aoty_user_reviews   INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (artist_id) REFERENCES Artist (id),
  FOREIGN KEY (genre_id) REFERENCES Genre (id),
  FOREIGN KEY (record_label_id) REFERENCES RecordLabel (id)
);

CREATE TABLE Song (
  id                  CHAR(22),
  name                VARCHAR(255) NOT NULL,
  album_id            CHAR(22),
  danceability        DECIMAL NOT NULL,
  energy              DECIMAL NOT NULL,
  song_key            INT NOT NULL,
  loudness            DECIMAL NOT NULL,
  acousticness        DECIMAL NOT NULL,
  mode                BOOL NOT NULL,
  speechiness         DECIMAL NOT NULL,
  instrumentalness    DECIMAL NOT NULL,
  liveness            DECIMAL NOT NULL,
  valence             DECIMAL NOT NULL,
  tempo               DECIMAL NOT NULL,
  explicit            BOOL NOT NULL,
  duration_ms         INT NOT NULL,
  time_signature      DECIMAL NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (album_id) REFERENCES Album(id)
);

-- CREATE TABLE Author (
--   id      INT,
--   name    VARCHAR(255) NOT NULL,
--   type    VARCHAR(100) NOT NULL,
--   PRIMARY KEY (id)
-- );

CREATE TABLE PitchforkReviews (
  id              INT,
  album_id        CHAR(22),
  url             VARCHAR(255) NOT NULL,
  score           DECIMAL NOT NULL,
  best_new_music  BOOL NOT NULL,
  pub_date        DATE NOT NULL,
  -- author_id       INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (album_id) REFERENCES Album (id)
  -- FOREIGN KEY (author_id) REFERENCES Author (id)
);

DROP DATABASE project;