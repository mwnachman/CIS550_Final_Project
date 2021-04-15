const mysql = require('mysql');
const con = mysql.createConnection({
  host: "",
  port: "",
  user: "",
  password: "",
  database: ""
});

/*-- POC query to prove the node app can connect to the db and express can parse the results as json --*/

function artistTest(req, res) {
  var query = `
  SELECT * FROM Album LIMIT 10
`;
con.query(query, function(err, rows, fields) {
  if (err) console.log(err);
  else {
    res.json(rows);
  }
});

};

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/*-- Get the top 5 popular albums from each year or genre ranked by AOTY User Score.  This will be used for the Landing/ Browsing by Popularity tab --*/
function top5(req, res) {
  var query = `
  SELECT *
  FROM (
    SELECT t1.release_year, t2.name AS genre, t1.title AS album, ROW_NUMBER() OVER (PARTITION BY t1.release_year ORDER BY t1.aoty_user_score DESC) AS score_rank
    FROM Album t1 JOIN Genre t2 ON t1.genre_id = t2.id) x
    WHERE score_rank <= 5;
  `;
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/*-- Get the most popular album from each genre within a range of years (user input). This will be used for the Landing/ Browsing by Popularity tab. --*/
function popularByGenre(req, res) {
  var dateRange = (req.params.years).split("-");
  var query = `
  SELECT * FROM (SELECT t1.release_year, t2.name AS genre, t1.title AS album, ROW_NUMBER() OVER (PARTITION BY t2.name ORDER BY t1.aoty_user_score DESC) AS score_rank FROM Album t1 JOIN Genre t2 ON t1.genre_id = t2.id) x WHERE release_year BETWEEN '`+dateRange[0]+`' AND '`+dateRange[1]+`' AND score_rank = 1;
  `;
  con.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

module.exports = {
  artistTest: artistTest,
  top5: top5,
  popularByGenre: popularByGenre
}