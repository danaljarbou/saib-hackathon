const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require('./db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));           


app.use(cors());






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