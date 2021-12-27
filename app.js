const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require('./db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));           


app.use(cors());



// Home Page 
app.get("/", (req, res) => {
  res.send("This is Home Page");
});

// Add problem page 
app.get("/problems/newProblem", (req, res) => {
  res.send("Add your problem here");
});

// Login Page 
app.get("/login", (req, res) => {
  res.send("please LOG IN");
});

// Problems Admin : display the admin problems which he added 
app.get("/problems/{userID}/allProblems", (req, res) => {
  res.send("this is a list of all the problems u added before");
});

// solutions per problem, when he click a problem, the solutions will appear
app.get("/problems/{problemID}/solutions", (req, res) => {
  res.send("all solutions for the problem");
});




// problem page , has all problems
app.get("/problems", (req, res) => {
  res.send("Hello world!");
});

// read more about one problem, has message submit your solutions
app.get("/problems/{problemID}", (req, res) => {
  res.send("Hello world!");
});

//review stage, relevent or not // ++ add review
app.get("/problems/{problemID}/solutions/{solutionID}/review", (req, res) => {
  res.send("Hello world!");
});

// scoring, for feasability and cost  
app.get("/problems/{problemID}/solutions/{solutionID}/scoring", (req, res) => {
  res.send("Hello world!");
});

// solutions per problem, when he click a problem, the solutions will appear
app.get("/problems/{problemID}/solutions/", (req, res) => {
  res.send("Hello world!");
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