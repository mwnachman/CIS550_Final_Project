import os
import sys
import json
import spotipy
import webbrowser
import spotipy.util as util
from json.decoder import JSONDecodeError
from spotipy.oauth2 import SpotifyClientCredentials

def lambda_handler(event, context):
  
  os.environ['SPOTIPY_CLIENT_ID'] = ''
  os.environ['SPOTIPY_CLIENT_SECRET'] = ''
  os.environ['SPOTIPY_REDIRECT_URI'] = ''
  
  spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

  artist_id = event['queryStringParameters']['artist']
  album_id = event['queryStringParameters']['album']

  body = {}

  if len(artist_id) > 0:
    artist_uri = 'spotify:artist:' + artist_id
    artist_results = spotify.artist(artist_uri)
    artist_image = artist_results['images'][0]
    body.update({'artist_image': artist_image})
  
  if len(album_id) > 0:
    album_uri = 'spotify:album:' + album_id
    album_results = spotify.album(album_uri)
    album_image = album_results['images'][0]
    body.update({'album_image': album_image})

  response = { 'statusCode': 200, 'headers': { 'Content-Type': 'application/json' }, 'body': json.dumps(body) }

  return response

