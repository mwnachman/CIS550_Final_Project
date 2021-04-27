export const columns = {
  artist: [
    {
      header:'Artist Name',
      label: 'Artist',
      minWidth: '30vh'
    },
    {
      header: 'Number of Albums',
      label: 'Album_count',
      minWidth: '10vh'
    },
    {
      header: 'Number of Songs',
      label: 'Song_count',
      minWidth: '10vh'
    }
  ],
  song: [
    {
      header: 'Song',
      label: 'Song',
      minWidth: '30vh'
    },
    {
      header: 'Artist',
      label: 'Artist',
      minWidth: '30vh'
    },
    {
      header: 'Album',
      label: 'Album',
      minWidth: '25vh'
    },
    {
      header: 'Action',
      minWidth: '10vh'
    }
  ],
  album: [
    {
      header: 'Album',
      label: 'Album',
      minWidth: '30vh'
    },
    {
      header: 'Artist',
      label: 'Artist',
      minWidth: '30vh'
    },
    {
      header: 'Format',
      label: 'Format',
      minWidth: '30vh'
    },
    {
      header: 'Record Label',
      label: 'Record_Label',
      minWidth: '30vh'
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

