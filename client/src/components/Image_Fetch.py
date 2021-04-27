
#### Instructions

#### Download and install python 3 (python 2 is the default?): https://www.youtube.com/watch?v=0rg6nyanX5Y
# download Python: https://www.python.org/downloads/
# Use Homebrew to install python 3:   CLI: brew install python

#### Install Spotipy:  https://www.youtube.com/watch?v=tmt5SdvTqUI
# Read Spotipy docs here:  https://spotipy.readthedocs.io/en/2.18.0/
# CLI:    sudo pip3 install spotipy
# CLI:    enter your password

#### Create a Spotify account
# spotify API information https://developer.spotify.com/documentation/web-api/
# go to developer.spotify.com
# register application on spotify: https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app
  # go to my dashboard: https://developer.spotify.com/dashboard/
  # click create an app
  # fill in description "app name: songrover, app description: An app to look at album artwork."
  # click "Edit settings" button
  # For "Redirect URIs", type in: http://google.com/  , then click "ADD" and "SAVE"
  # save client ID as SPOTIPY_CLIENT_ID below
  # click "show client secret" and save as SPOTIPY_CLIENT_SECRET below

#### Set up Spotipy with our Spotify values
# CLI:    export SPOTIPY_CLIENT_ID='a5f55adbfc4a47f5ab95b106504958d3'
# CLI:    export SPOTIPY_CLIENT_SECRET='101395bebefd48928bbda0567f9454f5'
# CLI:    export SPOTIPY_REDIRECT_URI='http://google.com/'

#### Run this program
# CLI:    navigate to this file
# CLI:    python3 Image_Fetch.py



import os
import sys
import json
import spotipy
import webbrowser
import spotipy.util as util
from json.decoder import JSONDecodeError
from spotipy.oauth2 import SpotifyClientCredentials


SPOTIPY_CLIENT_ID = 'a5f55adbfc4a47f5ab95b106504958d3'
SPOTIPY_CLIENT_SECRET = '101395bebefd48928bbda0567f9454f5'
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())


artist_id = '3fMbdgg4jU18AjLCKBhRSm'  # Sample spotify id for testing
album_id = '0oX4SealMgNXrvRDhqqOKg'  # Sample spotify id for testing
song_id = '7EsjkelQuoUlJXEw7SeVV4'  # Sample spotify id for testing

artist_uri = 'spotify:artist:' + artist_id
album_uri = 'spotify:album:' + album_id
song_uri = 'spotify:track:' + song_id




#get artist image from Spotify API using artist_id
artist_results = spotify.artist(artist_uri)
#print(json.dumps(artist_results, sort_keys=True, indent = 4))  #pretty print results
artist_image = artist_results['images'][0]
print("artist image link")
print (artist_image)
print()



#get album image from Spotify API using album_id
album_results = spotify.album(album_uri)
##print(json.dumps(album_results, sort_keys=True, indent = 4))  #pretty print results
album_image = album_results['images'][0]
print("album image link")
print (album_image)
print()
print("album preview urls for tracks")
for track in album_results['tracks']['items']:
    print('track name')
    print( track['name'])
    print('preview url')
    print( track['preview_url'])
    print()



#get song image from Spotify API using song_id
song_results = spotify.track(song_uri)
#print(json.dumps(song_results, sort_keys=True, indent = 4))  #pretty print results
song_image = song_results['album']['images'][0]
print("song image link")
print (song_image)
print()
song_preview = song_results['preview_url']
print("song preview url")
print (song_preview)

# preview_url entry # link for spotify


#learn spotipy #6



# Example, get 30 second samples and cover art for the top 10 tracks for Led Zeppelin
#results = spotify.artist_top_tracks(artist_uri)
#for track in results['tracks'][:10]:
   # print('track    : ' + track['name'])
   # print('audio    : ' + track['preview_url'])
   # print('cover art: ' + track['album']['images'][0]['url'])
   # print()


