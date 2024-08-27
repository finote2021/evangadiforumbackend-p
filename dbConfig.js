const mysql2 = require("mysql2");
const dotenv = require('dotenv').config()

// Access environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Create a MySQL connection pool
const dbConnection = mysql2.createPool({
  user: DB_USER,
  database: DB_NAME,
  host: DB_HOST,
  password: DB_PASSWORD,
  connectionLimit: 10,
});

// Export the connection pool with promises
module.exports = dbConnection.promise();
