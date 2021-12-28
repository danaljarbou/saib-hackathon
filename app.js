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

////---- post -----

//post login information 
app.post('/login-post', async (req, res) => {
  
  const { user_id, password } = req.body;

  const client = await pool.connect()
  await client.query(
    `INSERT INTO "users" ("user_id", "email", "password","role","name" ) VALUES ($1, $2, $3, $4, $5)`,
     [5556677, 555, 5555, 5555, 5555],
  
    (error, results) => {
      if (error) {-3
        throw error;
      }

      return res.sendStatus(201);
   
    }
  )
  
client.release( )

  
});


//post a problem to database
app.post('/share_proplem', async (req, res) => {
  
  const { proplem_Id, manager_Id, title, bref, description, publish_date, due_date, reward_amount, it_department, reviewer_Id, analyst_Id, finance_Id } = req.body;

  const client = await pool.connect()
  await pool.query(
    `INSERT INTO "problem" ("proplem_Id",  "manager_Id", "title", "bref", "description", "publish_date", "due_date", "reward_amount", "it_department", "reviewer_Id", "analyst_Id" , "finance_Id" ) VALUES ($1,$2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [proplem_Id , manager_Id, title, bref, description, publish_date, due_date, reward_amount, it_department, reviewer_Id, analyst_Id, finance_Id],

    (error, results) => {
      if (error) {
        throw error;
      }

      return res.sendStatus(201);
    }
  )
  client.release( )

});

//post a solution to database
app.post('/propse_solution', async (req, res) => {
  const { solution_Id, name, email, description, attachment, stage, problem_Id } = req.body;

  const client = await pool.connect()
  await pool.query(
    `INSERT INTO "solution_proposed" ("solution_Id",  "name", "email", "description", "attachment", "stage", "problem_Id" ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [solution_Id, name, email, description, attachment, stage, problem_Id],

    (error, results) => {
      if (error) {
        throw error;
      }

      return res.sendStatus(201);
    }
  )
  client.release( )
});


// //score a solution 

// //review solution
app.post('/score/stage/review', async (req, res) => {

  const { solution_Id, total_score } = req.body;
  const client = await pool.connect()
  await pool.query(
    `INSERT INTO "score" ("solution_Id",  "total_score" ) VALUES ($1, $2)`,
    [solution_Id, total_score],

    (error, results) => {
      if (error) {
        throw error;
      }

      return res.sendStatus(201);
    }
  )
  client.release( )
});




  
// //review  feasibility and of a solution
app.post('/score/stage/feasibility/cost', async (req, res) => {
  
  const { solution_Id, total_score } = req.body;
  const client = await pool.connect()
  await pool.query(
    //we will get the data from one page so we sum the value in HTML 
    `INSERT INTO "score" ("solution_Id",  "total_score" ) VALUES ($1, $2)`,
    [solution_Id, total_score],
  
     (error, results) => {
      if (error) {
        throw error;
      }

      return res.sendStatus(201);
    }
  )
  client.release( )

});


//

// app.post("/user", async (req, res) => {
//   const { user_id, email, password, role, name } = req.body;

//   await pool.connect();
//   await pool.query(
//     `INSERT INTO "users" ("user_id", "email", "password","role","name" ) VALUES ($1, $2, $3, $4, $5)`,
//     [user_id, email, password, role, name],

//     (error, results) => {
//       if (error) {
//         throw error;
//       }

//       return res.sendStatus(201);
//     }
//   )
//   res.end()
// });




app.listen(8000, () => {
  console.log('pools is ' + pool);
  console.log(`Server is running.`);
});