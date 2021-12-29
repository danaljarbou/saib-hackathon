const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require('./db');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
//setup public folder
app.use(express.static('./public'));

app.use(cors());



// Home Page 
app.get("/home", (req, res) => {
  console.log('inside home route');
  res.render('homePage');
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
app.get("/problems/:userID/allProblems", async (req, res) => {
   await pool.connect(function(err, client, done) {
     if (err){
       console.log(err.message);
     }
    let sql = `select * from "problem" where "manager_Id" =$1`;
    let values = [req.params.userID];

    console.log(req.params.userID);


    client.query(sql, values, function(err, result) {
        done(); // releases connection back to the pool        
        // Handle results
        if (err)
        console.log(err.message);
        console.log(result.rows);
        res.render('ProblemsAdmin', {
          problems: result.rows,
        })
    });
});
})


// solutions per problem, when he click a problem, the solutions will appear
app.get("/problems/:problemID/solutions", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/solutionsPerProblem.html'));
});

app.get('/problems/:problemID/solutions/data', (req, res)=>{
      pool.query(`Select description from solution_proposed`, (err, result)=>{
          if(!err){
              res.send(result.rows);
          }
      });
      pool.end;
  })
  pool.connect();

// problem page , has all problems
app.get("/problems/viewAll", async (req, res) => {

  await pool.connect();
  await pool.query("SELECT * from problem", (err, results) => {
    //console.log( results.rows);
    res.render('Problempage', {
      problems: results.rows,
    })
   })
});

// read more about one problem, has message submit your solutions
app.get("/problems/problemDescription/:problemID", async (req, res) => {

  await pool.connect(function(err, client, done) {
    if (err){
      console.log(err.message);
    }
   let sql = `select * from "problem" where "proplem_Id" =$1`;
   let values = [req.params.problemID];
    client.query(sql, values, function(err, result) {
       done(); // releases connection back to the pool        
       // Handle results
       if (err)
       console.log(err.message);
       //console.log(result.rows);
       res.render('Descriptionpage', {
         problem: result.rows[0],
       })
   });
});


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
// app.post('/login-post', async (req, res) => {
  
//   const { user_id, password } = req.body;

//   const client = await pool.connect()
//   await client.query(
//     `INSERT INTO "users" ("user_id", "email", "password","role","name" ) VALUES ($1, $2, $3, $4, $5)`,
//      [5556677, 555, 5555, 5555, 5555],
  
//     (error, results) => {
//       if (error) {-3
//         throw error;
//       }

//       return res.sendStatus(201);
   
//     }
//   )
  
// client.release( )

  
// });


//post a problem to database
app.post('/share_proplem', async (req, res) => {
  
  const { proplem_Id, manager_Id, title, bref, description, publish_date, due_date, reward_amount, it_department, reviewer_Id, analyst_Id, finance_Id } = req.body;

  const client = await pool.connect()
  await pool.query(
    `INSERT INTO "problem" ("proplem_Id",  "manager_Id", "title", "bref", "description", "publish_date", "due_date", "reward_amount", "it_department", "reviewer_Id", "analyst_Id" , "finance_Id" ) VALUES ($1,$2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [proplem_Id , 111, title, bref, description, publish_date, due_date, reward_amount, it_department, reviewer_Id, analyst_Id, finance_Id],

    (error, results) => {
      if (error) {
        throw error;
      }

      return res.redirect('/problems/111/allProblems');
    }
  )
  client.release( )

});

//post a solution to database
app.post('/propse_solution', async (req, res) => {
  console.log(req.body);
  const { solution_Id, name, email, description,problem_Id } = req.body;

  const client = await pool.connect()
  await pool.query(
    `INSERT INTO "solution_proposed" ("solution_Id",  "name", "email", "description", "attachment", "stage", "problem_Id" ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [solution_Id, name, email, description,'True', 'Review', problem_Id],

    (error, results) => {
      if (error) {
        throw error;
      }
      return res.redirect('/problems/viewAll'); // after submitting a soultion, send the person to the page of all problems
    }
  )
  client.release( )
});


// //score a solution 

// //review solution
// app.post('/score/stage/review', async, (req, res) => {
//   res.send("review  the solution");
//   const { solution_Id, total_score } = req.body;
//   await pool.connect();
//   await pool.query(
//     `INSERT INTO "users" ("solution_Id",  "total_score" ) VALUES ($1, $2)`,
//     [solution_Id, total_score],

//     (error, results) => {
//       if (error) {
//         throw error;
//       }

//       return res.sendStatus(201);
//     }
//   )
//   res.end()
// });


// //review  feasibility of a solution
// app.post('/score/stage/feasibility', async (req, res) => {
//   res.send("Scoring feasibility of the solution");
//   const { solution_Id, total_score } = req.body;

//   await pool.connect();
//   await pool.query(
//     `INSERT INTO "users" ("solution_Id",  "total_score" ) VALUES ($1, $2)`,
//     [solution_Id, total_score],

//     (error, results) => {
//       if (error) {
//         throw error;
//       }

//       return res.sendStatus(201);
//     }
//   )
//   res.end()
// });


// //review costing os a solution
// app.post('/score/stage/cost', async, (req, res) => {
//   res.send("Scoring the cost of a solution");
//   const { solution_Id, total_score } = req.body;

//   await pool.connect();
//  await pool.query(
//     `INSERT INTO "users" ("solution_Id",  "total_score" ) VALUES ($1, $2)`,
//     [solution_Id, total_score],

//     (error, results) => {
//       if (error) {
//         throw error;
//       }

//       return res.sendStatus(201);
//     }
//   )
//   res.end()
// });




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