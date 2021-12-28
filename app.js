const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require('./db');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));   

//app.use(express.static('./public'));
//app.use(express.static(`${__dirname}/public`));

app.use(cors());



// Home Page 
app.get("/", (req, res) => {
  
  res.sendFile(path.join(__dirname, 'public/homePage.html'));
});

// Add problem page 
app.get("/problems/newProblem", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/addProblem.html'));
});

// Login Page 
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Problems Admin : display the admin problems which he added 
app.get("/problems/:userID/allProblems", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/problemsAdmin.html'));
});

// solutions per problem, when he click a problem, the solutions will appear
app.get("/problems/:problemID/solutions", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/solutionsPerProblem.html'));
});




// problem page , has all problems
app.get("/problems", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Problempage.html'));
});

// read more about one problem, has message submit your solutions
app.get("/problems/:problemID", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Descriptionpage.html'));
});

//review stage, relevent or not // ++ add review
app.get("/problems/:problemID/solutions/:solutionID/review", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Reviewpage.html'));
});

// scoring, for feasability and cost 
app.get("/problems/:problemID/solutions/:solutionID/scoring", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Scoringpage.html'));
});

// solutions per problem, when he click a problem, the solutions will appear
app.get("/problems/:problemID/solutions/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/solutionsPerProblem.html'));
});






app.post("/user", async (req, res) => {
    const {user_id , email, password,role,name } = req.body;
 
    await pool.connect()
    await pool.query(
    `INSERT INTO "users" ("user_id", "email", "password","role","name" ) VALUES ($1, $2, $3, $4, $5)`,
      [user_id, email, password, role,name],

      (error, results) => {
        if (error) {
          throw error;
        }
  
        return  res.sendStatus(201);
      }
    );
  });




app.listen(8000, () => {
    console.log('pools is '+ pool);
  console.log(`Server is running.`);
});