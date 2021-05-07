# Sonalysis
*Outgrowth of a database course project*

<br />

## tldr;
This app serves as an interactive resource for finding information about music and discovering new music. Users are able to search a subset of Spotify's catalogue and find song recommendations based on dynamic custom algorithm that takes into account user preferences on a number of musical attributes.

###### Browse page: 
- Presents an abbreviated set of genres and song traits, which when selected, populate groupings of top albums based on Album of the Year data

###### Search page:
- Returns results for keywords that represent either a song name, an album name, or an artist name. Exact matches, LIKE matches, and fuzzy matches are given back to the user in order of relevancy.

###### Recommendations page:
- Available to the users after an item is accessed from Search results. Users are able to manipulate the attributes that are submitted to the recommendation algorithm based on their preferences. They can also choose which attributes the algorithm should include or disregard. 

###### Artist / Album Modals:
- Can be accessed across the application. They offer information to about albums and artists, including the ability to see song attributes, play snippets and see album art

<br />


###### To run locally:

- Create a client.json file in client/config modeled on client-template.json file.  Replace any passwords necessary.

- From the client directory, run 'npm install' to install dependencies

- To start the client, use the command 'npm start'

- In the browser, navigate to http://localhost:8080/

- Hot reloading is enabled
