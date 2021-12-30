const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require('./db');
const path = require('path');
const session = require("express-session");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
//setup public folder
app.use(express.static('./public'));

app.use(cors());

app.use(
  session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

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
  res.render('login');
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
});


// solutions per problem, when he click a problem, the solutions will appear
app.get("/problems/:problemID/solutions", async(req, res) => {

  await pool.connect(function(err, client, done) {
    if (err){
      console.log(err.message);
    }
   let sql = `Select * from solution_proposed where "problem_Id" =$1`;
   let values = [req.params.problemID];

   console.log(req.params.problemID);


   client.query(sql, values, function(err, result) {
       done(); // releases connection back to the pool        
       // Handle results
       if (err)
       console.log(err.message);
       console.log(result.rows);
       res.render('solutionsPerProblem', {
         solutions: result.rows,
       })
   });
  });
});


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
app.get("/problems/:problemID/solutions/:solutionID/review", async (req, res) => {
  //res.sendFile(path.join(__dirname, 'public/Reviewpage.html'));

  //Select * from problem  Inner JOIN solution_proposed ON problem."proplem_Id"= solution_proposed."problem_Id"
  await pool.connect(function(err, client, done) {
    if (err){
      console.log(err.message);
    }
   let sql = `Select * from problem  Inner JOIN solution_proposed ON problem."proplem_Id"= solution_proposed."problem_Id" where "solution_Id" =$1`;
   let values = [req.params.solutionID];


   client.query(sql, values, function(err, result) {
       done(); // releases connection back to the pool        
       // Handle results
       if (err)
       console.log(err.message);
       console.log(result.rows);
       res.render('Reviewpage', {
         problemAndSolution: result.rows[0],
       })
   });
  });


});

// scoring, for feasability and cost 
app.get("/solutions/:solutionID/scoring", async (req, res) => {

  await pool.connect(function(err, client, done) {
    if (err){
      console.log(err.message);
    }
   let sql = `Select * from problem  Inner JOIN solution_proposed ON problem."proplem_Id"= solution_proposed."problem_Id" where "solution_Id" =$1`;
   let values = [req.params.solutionID];


   client.query(sql, values, function(err, result) {
       done(); // releases connection back to the pool        
       // Handle results
       if (err)
       console.log(err.message);
       console.log(result.rows);
       res.render('Scoringpage', {
         problemAndSolution: result.rows[0],
       })
   });
  });

});

// solutions per problem, when he click a problem, the solutions will appear
app.get("/problems/:problemID/solutions/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/solutionsPerProblem.html'));
});

////---- post -----


app.post('/login', async (req, res) => {
  console.log(req.body);
  const {email , password}= req.body;
	
    const client = await pool.connect()
    await  pool.query(`SELECT * FROM "users" WHERE "email" = $1 AND "password" = $2`,
     [email, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      return res.redirect('/problems/111/allProblems')
    }
    
    );
     
      client.release( )
		});

    
    

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
// Edit Manager problem
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
    `INSERT INTO "solution_proposed" ("solution_Id",  "name", "email", "description_s", "attachment", "stage", "problem_Id" ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
app.post('/score/stage/review/:solutionID', async (req, res) => {

  const {total_score } = req.body;
  const {solutionID} = req.params;
  const client = await pool.connect()
  await pool.query(
    `INSERT INTO "score" ("solution_Id",  "total_score" ) VALUES ($1, $2)`,
    [solutionID, total_score],

    (error, results) => {
      if (error) {
        throw error;
      }

      return res.redirect(`/solutions/${solutionID}/scoring`);
    }
  )
  client.release( )
});




  
// //review  feasibility and cost of a solution
app.post('/score/stage/feasibility/cost/:solutionID', async (req, res) => {
  
  const { total_score } = req.body;
  const { solutionID } = req.params;

  await pool.connect(function(err, client, done) {
    if (err){
      console.log(err.message);
    }
   let sql = `Update score set total_score=$1 where "solution_Id" =$2`;
   let values = [total_score, solutionID];


   client.query(sql, values, function(err, result) {
       done(); // releases connection back to the pool        
       // Handle results
       if (err)
       console.log(err.message);
       res.redirect('/problems/111/allProblems')
   });
  });

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