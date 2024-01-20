// Import the promise wrapper from mysql2
const mysql = require('mysql2/promise');

// Create a promise-based pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'scanner',
  password: 'scanner',
  database: 'bugbounty',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
