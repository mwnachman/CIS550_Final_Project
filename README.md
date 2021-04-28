# Sonalysis
*MCIT CIS 550 Final Project, Spring 2021*  

*Meredith Latasa, William Whitehead, Holland Delany, Andrew Cho*

<br />

## Description of functionality
Our platform serves as an interactive resource for finding information about music and discovering new music. Users are able to browse superlatives, search for songs, albums, and artists, and receive music recommendations based on a dynamic, customizable algorithm.

The application follows a multi-page tab structure where each page provides distinct functionality:

###### Home page:
- Introduces the application and presents random music elements to the user based on a selected genre.

###### Browse page: 
- Presents a set of genres and song traits, which when selected, populate groupings of top albums for the user to view

###### Page View / Modal:
- Can be accessed across the entire application. They offer information to the user when they click on an item. This includes statistics and insights specific to the item.

###### Search page:
- Developed to return results for keywords that represent either a song name, an album name, or an artist name. Exact matches, LIKE matches, and fuzzy matches are given back to the user in order of relevancy.

###### Recommendations page:
- Available to the users after an item is accessed from Search results. Users are able to manipulate the attributes that are submitted to the recommendation algorithm based on their preferences. They can also choose which attributes the algorithm should include or disregard. 

<br />

## Instructions for building it locally 


###### To run the server:

- Create a server.json file in server/config modeled on server-template.json file.  Request the database password from an administrator.

- From the server directory, run 'npm install' to install dependencies.

- To run the server, use the command 'npm run watch'.


###### To run the client:

- Create a client.json file in client/config modeled on client-template.json file.  Replace any psswords necessary.

- From the client directory, run 'npm install' to install dependencies.

- To start the client, use the command 'npm start'.

- In the browser, navigate to http://localhost:8080/  or  http://localhost:8084/ 


Both the client and server have hot reloading enabled.



<br />

## Architecture

###### Client:
-  ReactJS application utilizing the Material-UI library for the user interface design.

###### Server:
-  Express Node.js application (deployed to AWS Lambda and API Gateway in production)

###### Database:
- MySQL database hosted by AWS RDS server. The seed datasets created in Python Jupyter notebook were uploaded to AWS RDS via MySQL Workbench. 

###### Artist & Album Artwork Service:
-  A Python script that integrates with the Spotify API and deployed to an AWS Lambda and API Gateway
