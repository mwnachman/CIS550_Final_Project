export const columns = {
  artist: [
    {
      header:'Artist Name',
      label: 'artist_name',
      style: {
        width: '50%',
      },
    },
    {
      header: 'Number of Albums',
      label: 'album_count',
      style: {
        width: '25%',
      },
    },
    {
      header: 'Number of Songs',
      label: 'song_count',
      style: {
        width: '25%',
      },
    }
  ],
  song: [
    {
      header: 'Song',
      label: 'song_name',
      style: {
        width: '30%',
      },
    },
    {
      header: 'Artist',
      label: 'artist_name',
      style: {
        width: '25%',
      },
    },
    {
      header: 'Album',
      label: 'album_name',
      style: {
        width: '25%',
      },
    },
    {
      header: 'Action',
      style: {
        width: '15%',
        paddingRight: 0,
      },
    },
  ],
  album: [
    {
      header: 'Album',
      label: 'album_name',
      style: {
        width: '30%',
      },
    },
    {
      header: 'Artist',
      label: 'artist_name',
      style: {
        width: '25%',
      },
    },
    {
      header: 'Release Year',
      label: 'release_year',
      style: {
        width: '5%',
      },
    },
    {
      header: 'Format',
      label: 'album_format',
      style: {
        width: '5%',
      },
    },
    {
      header: 'Record Label',
      label: 'record_label_name',
      style: {
        width: '17%',
      },
    },
    {
      header: 'Pitchfork',
      label: 'review_url',
      style: {
        width: '18%',
        paddingRight: 0
      },
    }
  ],
  album_abbreviated: [
    {
      header: 'Album',
      label: 'album_name',
      style: {
        width: '40%',
      },
    },
    {
      header: 'Artist',
      label: 'artist_name',
      style: {
        width: '40%'
      },
    },
    {
      header: 'Release Year',
      label: 'release_year',
      style: {
        width: '10%',
      },
    },
    {
      header: 'Format',
      label: 'album_format',
      style: {
        width: '10%',
      },
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
    style: {
      minWidth: '50%',
    },
  },
  {
    header: 'Format',
    label: 'album_format',
    style: {
      minWidth: '10%',
    },
  },
  {
    header: 'Record Label',
    label: 'record_label_name',
    style: {
      minWidth: '30%',
    },
  },
  {
    header: 'Release Year',
    label: 'release_year',
    style: {
      minWidth: '10%',
    },
  }
]

export const recommendedSongHeaders = [
  {
    header: 'Song',
    label: 'song_name',
    style: {
      minWidth: '40%',
    },
  },
  {
    header: 'Artist',
    label: 'artist_name',
    style: {
      minWidth: '30%',
    },
  },
  {
    header: 'Album',
    label: 'album_name',
    style: {
      minWidth: '30%',
    },
  },
]

export const tracklistHeaders = [
  {
    header: '#',
    label: 'track_number',
    style: {
      minWidth: '3%',
    },
  },
  {
    header: 'Track',
    label: 'song_name',
    style: {
      minWidth: '27%',
    },
  },
  {
    header: 'Length',
    label: 'time_seconds',
    style: {
      minWidth: '5%',
    },
  },
  {
    header: 'Energy',
    label: 'energy',
    style: {
      minWidth: '5%',
    },
  },
  {
    header: 'Danceability',
    label: 'danceability',
    style: {
      minWidth: '5%',
    },
  },
  {
    header: 'Tempo',
    label: 'tempo',
    style: {
      minWidth: '5%',
    },
  },
  {
    header: 'Listen',
    label: 'play',
    style: {
      minWidth: '10%',
    },
  }
]

export const genreMenuItems = [
  {
    text: 'Alternative Rock & Pop',
    value: 8
  },
  {
    text: 'Country & Folk',
    value: 4
  },
  {
    text: 'Dance & Electronic',
    value: 3
  },
  {
    text: 'Hip-Hop',
    value: 2
  },
  {
    text: 'Jazz',
    value: 5
  },
  {
    text: 'Metal & Punk',
    value: 7
  },
  {
    text: 'Other',
    value: 6
  },
  {
    text: 'R&B',
    value: 1
  },
  {
    text: 'Rock & Pop',
    value: 0
  }
]

export const criteriaMenuItems = [
  {
    text: 'Top Overall in Genre',
    value: 'top'
  },
  {
    text: 'Most Danceable',
    value: 'danceability'
  },
  {
    text: 'Most Energetic',
    value: 'energy'
  },
  {
    text: 'Loudest',
    value: 'loudness'
  },
  {
    text: 'Most Acoustic',
    value: 'acousticness'
  },
]
