
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "exact_solution",
  password: "Cloud@123$",
  port: 5432 // change to your port 
});

module.exports = pool;