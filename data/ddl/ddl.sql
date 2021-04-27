CREATE TABLE Artist (
  id      CHAR(22),
  name    VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  INDEX artist_name_ind(name)
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
  num_aoty_critic_reviews INT NOT NULL,
  num_aoty_user_reviews   INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (artist_id) REFERENCES Artist (id),
  FOREIGN KEY (genre_id) REFERENCES Genre (id),
  FOREIGN KEY (record_label_id) REFERENCES RecordLabel (id),
  INDEX album_name_ind(title)
);

CREATE TABLE Song (
  id                  CHAR(22),
  name                VARCHAR(255) NOT NULL,
  album_id            CHAR(22),
  disc_number         INT,
  track_number        INT,
  danceability        DECIMAL(3,3) NOT NULL,
  energy              DECIMAL(3,3) NOT NULL,
  song_key            INT NOT NULL,
  loudness            FLOAT NOT NULL,
  acousticness        DECIMAL(6,6) NOT NULL,
  mode                BOOL NOT NULL,
  speechiness         DECIMAL(4,4) NOT NULL,
  instrumentalness    DECIMAL(6,6) NOT NULL,
  liveness            DECIMAL(4,4) NOT NULL,
  valence             DECIMAL(3,3) NOT NULL,
  tempo               FLOAT NOT NULL,
  explicit            BOOL NOT NULL,
  duration_ms         INT NOT NULL,
  time_signature      FLOAT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (album_id) REFERENCES Album(id),
  INDEX song_name_ind(name)
);

CREATE TABLE PitchforkReviews (
  id              INT,
  album_id        CHAR(22),
  url             VARCHAR(255) NOT NULL,
  score           FLOAT NOT NULL,
  pub_date        DATE NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (album_id) REFERENCES Album (id)
);

CREATE TABLE SimilarGenres (
  id            INT,
  genre_code    INT NOT NULL,
  genre_matches INT NOT NULL,
  PRIMARY KEY (id)
);
