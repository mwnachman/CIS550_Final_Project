export const columns = {
  artist: [
    {
      header:'Artist Name',
      label: 'artist_name',
      minWidth: '30vh'
    },
    {
      header: 'Number of Albums',
      label: 'album_count',
      minWidth: '10vh'
    },
    {
      header: 'Number of Songs',
      label: 'song_count',
      minWidth: '10vh'
    }
  ],
  song: [
    {
      header: 'Song',
      label: 'song_name',
      minWidth: '30vh'
    },
    {
      header: 'Artist',
      label: 'artist_name',
      minWidth: '30vh'
    },
    {
      header: 'Album',
      label: 'album_name',
      minWidth: '25vh'
    },
    {
      header: 'Action',
      minWidth: '10vh'
    },
  ],
  album: [
    {
      header: 'Album',
      label: 'album_name',
      minWidth: '25vh'
    },
    {
      header: 'Artist',
      label: 'artist_name',
      minWidth: '25vh'
    },
    {
      header: 'Release Year',
      label: 'release_year',
      minWidth: '10vh'
    },
    {
      header: 'Format',
      label: 'album_format',
      minWidth: '10vh'
    },
    {
      header: 'Record Label',
      label: 'record_label_name',
      minWidth: '20vh'
    },
    {
      header: 'Pitchfork',
      label: 'review_url',
      minWidth: '20vh'
    }
  ]
}

export const songAttributes = [
  {
    min: 1940,
    max: 2020,
    step: 1,
    dbName: 'release_year',
    label: 'Release Year',
    description: 'Year in which the track was released'
  },
  {
    min: 0,
    max: 1,
    step: 0.1,
    dbName: 'energy',
    label: 'Energy Level',
    description: 'How intense and active a track is'
  },
  {
    min: 0,
    max: 1,
    step: 0.1,
    dbName: 'danceability',
    label: 'Danceability',
    description: 'How suitable a track is for dancing'
  },
  {
    min: 0,
    max: 1,
    step: 0.1,
    dbName: 'speechiness',
    label: 'Speechiness',
    description: 'Proportion of spoken words in the track'
  },
  {
    min: 0,
    max: 250,
    step: 10,
    dbName: 'tempo',
    label: 'Tempo',
    description: 'Overall tempo of a track, in beats per minute (BPM)'
  },
  {
    min: 0,
    max: 1,
    step: 0.1,
    dbName: 'acousticness',
    label: 'Acousticness',
    description: 'Confidence measure of whether a track is acoustic'
  },
  {
    min: 0,
    max: 1,
    step: 0.1,
    dbName: 'liveness',
    label: 'Liveness',
    description: 'Detects live audience in a track. Represents the probability that a track was performed live'
  },
  {
    min: 0,
    max: 1,
    step: 0.1,
    dbName: 'instrumentalness',
    label: 'Instrumentalness',
    description: 'Proportion of instrumental parts in a track'
  },
  {
    min: -60,
    max: 6,
    step: 0.5,
    dbName: 'loudness',
    label: 'Loudness',
    description: 'Overall loudness of the track, in decibels (dB)'
  }
]

export const artistModalColumns = [
  {
    header: 'Album',
    label: 'album_name',
    minWidth: '30vh'
  },
  {
    header: 'Format',
    label: 'album_format',
    minWidth: '30vh'
  },
  {
    header: 'Record Label',
    label: 'record_label_name',
    minWidth: '30vh'
  },
  {
    header: 'Release Year',
    label: 'release_year',
    minWidth: '20vh'
  }
]

export const recommendedSongHeaders = [
  {
    header: 'Song',
    label: 'song_name',
    minWidth: '30vh'
  },
  {
    header: 'Artist',
    label: 'artist_name',
    minWidth: '30vh'
  },
  {
    header: 'Album',
    label: 'album_name',
    minWidth: '30vh'
  },
]

export const tracklistHeaders = [
  {
    header: '#',
    label: 'track_number',
    minWidth: '5vh'
  },
  {
    header: 'Track',
    label: 'song_name',
    minWidth: '15vh'
  },
  {
    header: 'Length',
    label: 'time_seconds',
    minWidth: '5vh'
  },
  {
    header: 'Energy',
    label: 'energy',
    minWidth: '5vh'
  },
  {
    header: 'Danceability',
    label: 'danceability',
    minWidth: '5vh'
  },
  {
    header: 'Tempo',
    label: 'tempo',
    minWidth: '5vh'
  },
  {
    header: 'Listen via Spotify',
    label: 'play',
    minWidth: '25vh'
  }
]
