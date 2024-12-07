const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  user: 'root',
  host: 'localhost',
  password: 'V1n1c1us',
  database: 'mei_management_system',
});

/*
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
*/

module.exports = pool;