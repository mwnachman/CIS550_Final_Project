# Sonalysis
*MCIT CIS 550 Final Project, Spring 2021*
*Meredith Latasa, William Whitehead, Holland Delany, Andrew Cho*

<br />

## Description of functionality
Our platform serves as an interactive resource for finding information about music and discovering new music. Users are able to browse superlatives, search for songs, albums, and artists, and receive music recommendations based on a dynamic, customizable algorithm.

The application follows a multi-page tab structure where each page provides distinct functionality:

Home page:
:  Introduces the application and presents music elements to the user.

Browse page: 
:  Presents a set of defined genres, which when selected, populate groupings of top albums for the user to view. Each grouping represents an album trait from our database.

Page View / Modal:
:  Can be accessed across the entire application. They offer information to the user when they click on an item. This includes statistics and insights specific to the item.

Search page:
:  Developed to return results for keywords that represent either a song name, an album name, or an artist name. Exact matches, LIKE matches, and fuzzy matches are given back to the user in order of relevancy.

Recommendations page:
:  Available to the users after an item is accessed from Search results. Users are able to manipulate the attributes that are submitted to the recommendation algorithm based on their preferences. They can also choose which attributes the algorithm should include or disregard. 

<br />

## Instructions for building it locally 


###### To run the server:

- Rename the server/config/server-template.json file to server.json, change password to the database password "LoULnBjnkbeiA66"

- From the server directory, run  'npm install'

- From the server directory, run  'npm run watch'


###### To run the client:

- Rename the client/config/client-template.json file to client.json

- From the client directory, run 'npm install'.  Navigate to localhost:8080.

- There's hot reloading set up for the client so you shouldn't have to restart either when you make changes.

- In the browser, navigate to http://localhost:8080/


<br />

## Architecture

Client:
: ReactJS application utilizing the Material-UI library for the user interface design.

Server:
: Express Node.js application (deployed to AWS Lambda and API Gateway in production)

Database:
: MySQL database hosted by AWS RDS server. The seed datasets created in Python Jupyter notebook were uploaded to AWS RDS via MySQL Workbench. 

Artist & Album Artwork Service:
: A Python script that integrates with the Spotify API and deployed to an AWS Lambda and API Gateway
