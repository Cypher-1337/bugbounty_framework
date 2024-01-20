// get the client
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'127.0.0.1',
    user: 'scanner',
    password: 'scanner',
    database: 'bugbounty'
});


module.exports = connection