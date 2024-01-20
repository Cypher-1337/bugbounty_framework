const connection = require('../db/mysqlPromise');
const cron = require('node-cron');
const { compareSavedContent } = require('./monitor'); // Adjust the path accordingly


let isProcessing = false;

function fetchUrlsToMonitor(batchSize = 5) {
    return new Promise(async (resolve, reject) => {
      try {
        const [results] = await connection.query('SELECT * FROM monitor WHERE monitor = 10 LIMIT ?', [batchSize]);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function updateMonitorValue(id, newValue) {
    return new Promise(async (resolve, reject) => {
      try {
        const [results] = await connection.query('UPDATE monitor SET monitor = ? where id = ?', [newValue, id]);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async function resetMonitorValues() {
    try {
      // Update all URLs with monitor = 11 to monitor = 10
      const [results] = await connection.query('UPDATE monitor SET monitor = 10 WHERE monitor = 11');
      console.log('Monitor values reset to 10');
      return results;
    } catch (error) {
      console.error('Error resetting monitor values:', error.message);
      throw error;
    }
  }

async function processUrls(){

    try {

        if(isProcessing){
            console.log("Previous process is still running. Skipping...");
            return ;
        }

        isProcessing = true;

        let offSet = 0;
        let batchSize = 5;

        const urls = await fetchUrlsToMonitor(batchSize)

        if (urls.length === 0){
            resetMonitorValues()
        }

        for (const urlInfo of urls){
            const {id, url, date } = urlInfo;
            
            compareSavedContent(url);
            
            await updateMonitorValue(id, 11);

        }

        offSet += batchSize;

    } catch (error) {
        console.error('Error processing URLs:', error.message);
    } finally {
        isProcessing = false;
    } 
}

// Define the cron job to run every 6 hours
cron.schedule('*/2 * * * * *', () => {
    console.log('Running scheduled task...');
  
    processUrls()

});
