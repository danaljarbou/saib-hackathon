const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require('./db');
const path = require('path');
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const app = express();
const initializePassport = require("./passportConfig");
const { log } = require("console");

initializePassport(passport);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



//to secure the session 
app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: "secret",
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());


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
app.get("/login", checkAuthenticated, (req, res) => {
 // res.sendFile(path.join(__dirname, 'public/login.html'));
 
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
app.get("/problems/viewAll",checkNotAuthenticated, async (req, res) => {

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
// '/problems/:userID/allProblems'

//post login information
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/problems/viewAll",
    failureRedirect: "/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

//post login information 
// app.post('/login-post', async (req, res) => {
  
//   // const { user_id, password } = req.body;

//   const client = await pool.connect()
  // await client.query(
  //   `INSERT INTO "users" ("user_id", "email", "password","role","name" ) VALUES ($1, $2, $3, $4, $5)`,
  //    [5556677, 555, 5555, 5555, 5555],
  
  //   (error, results) => {
  //     if (error) {-3
  //       throw error;
  //     }

  //     return res.sendStatus(201);
   
  //   }
  // )
  
// client.release( )
////////passport.authenticate("local", {
   
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




  
// //review  feasibility and cost of a solution
app.post('/score/stage/feasibility/cost', async (req, res) => {
  
  const { solution_Id, total_score } = req.body;
  const client = await pool.connect()
  await pool.query(
    //we will get the data from one page so we sum the value in HTML 
    `UPDATE "score" SET  "total_score" = $2   WHERE "solution_Id" = $1`,

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


//act like registeration form to register the hash password 

app.post('/user', async (req, res) => {
  const { user_id, email, password, role, name } = req.body;

  await pool.connect();
  
    let hashedPassword = await bcrypt.hash(password, 10);
    //console.log(hashedPassword);
    await pool.query(
      `INSERT INTO "users" ("user_id", "email", "password","role","name" ) VALUES ($1, $2, $3, $4, $5)`,
      [user_id, email, hashedPassword, role, name],
      (error, results) => {
          if (error) {
            throw error;
          }
          console.log(results.rows);
        
        
        
        }

    )


  res.end()
});




app.listen(8000, () => {
  console.log('pools is ' + pool);
  console.log(`Server is running.`);
});