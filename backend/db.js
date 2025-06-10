// backend/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool with promise support
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // e.g., 'localhost'
  user: process.env.DB_USER,       // e.g., 'root'
  password: process.env.DB_PASSWORD, // your MySQL password
  database: process.env.DB_NAME,   // your database name
  waitForConnections: true,
  connectionLimit: 10,             // max number of connections in pool
  queueLimit: 0
});

// Export the pool with promise support for async/await queries
module.exports = pool.promise();
