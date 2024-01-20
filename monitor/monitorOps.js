const connection = require('../db/mysql'); // Import your MySQL connection
const { compareSavedContent } = require('./monitor'); // Update the path


function checkUrlExists(url) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT id FROM monitor WHERE url = ?', [url], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0); // Resolve with true if URL exists, false otherwise
        }
      });
    });
  }
  
function insertIntoDatabase(url, monitor, date) {
  checkUrlExists(url)
    .then(urlExists => {
      if (!urlExists) {
        const sql = 'INSERT INTO monitor (url, monitor, date) VALUES (?, ?, ?)';
        const values = [url, monitor, date];

        connection.query(sql, values, (error, results) => {
          if (error) {
            console.error('Error inserting into database:', error.message);
          } else {
            console.log(`Inserted into database. Rows affected: ${results.affectedRows}`);
          }
        });
      } 
    })
    .catch(error => {
      console.error('Error checking URL existence:', error.message);
    });
}


function runningMonitor(url){

    const currentDate = new Date().toISOString().substring(0, 19);

    // Insert the URL, monitor, and current date into the database
    insertIntoDatabase(url, 10, currentDate);

    compareSavedContent(url);

}

module.exports = { runningMonitor };


