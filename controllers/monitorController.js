const fs = require('fs');
const path = require('path');

const connection = require('../db/mysql')


const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

const getAllMonitor = async (req, res) => {


  const id = req.query.id;

    try {

      if (id && id !== ''){

        connection.execute(
          'SELECT * FROM `monitor` WHERE `id` = ? ',
          [id],
          function(err, results, fields) {
  
            
            // Format the date in each result
            const formattedResults = results.map((result) => ({
              ...result,
              date: formatDateTime(result.date), // Assuming 'date' is the column with the date string
            }));
  
            res.json(formattedResults);
            
          }
        );
      }
      else{

        // Read the 'limit' query parameter with a default value of 500
        const limit = parseInt(req.query.limit, 10) || 10000;
    
        connection.execute(
          `SELECT * FROM monitor order by count desc limit ${limit}`,
          function(err, results, fields) {
  
            if (err) {
                res.json("Internal Server Error")
            }
            
            // Format the date in each result
            const formattedResults = results.map((result) => ({
              ...result,
              date: formatDateTime(result.date), // Assuming 'date' is the column with the date string
            }));
  
            res.json(formattedResults);
            
          }
        );
      }
  
     
    } catch (error) {
      res.status(500).json({ message: error });
    }
};

const updateMonitor = async (req, res) => {
  try {

    // Get the domain details from the request body
    const id = req.body.id;
    const monitor = req.body.monitor;

    connection.execute(
      `UPDATE monitor SET monitor = ? WHERE id = ?`,
      [monitor, id],
      function(err, results, fields) {
        if (err) {
          console.error('Error updating data:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json("Monitor Updated Successfully");
      }
    );
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const deleteMonitor = async (req, res) => {
  try {
  
    const id = req.params.id;

    connection.execute(
      `DELETE FROM monitor WHERE id=?`,
      [id],
      function(err, results, fields) {
        if (err) {
          console.error('Error updating data:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json("Monitor Deleted Successfully");
      }
    );

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  
  }
}


const displayMonitor = async (req, res) => {
  const url = req.query.url;
  
  // when you want to get specific diff_ file
  let file = ''
  if(req.query.file){
    file = req.query.file
  }

  const savedFolder = path.join('/home/kali/Desktop/saved_content', getDomainName(url));
  const endpointPath = getEndpointPath(url);
  const domainDirectory = path.join(savedFolder, endpointPath);

  try {
    const savedHtmlPath = path.join(domainDirectory, `saved_html${endpointPath}.txt`);
    const savedHtml = fs.existsSync(savedHtmlPath) ? fs.readFileSync(savedHtmlPath, 'utf-8') : '';

    // Get all files in the directory
    const files = fs.readdirSync(domainDirectory);

    // Filter out files that don't match the expected format
    const diffFiles = files.filter(file => file.includes('_diff'));

    // Sort the files by modification time in descending order
    diffFiles.sort((a, b) => {
      const pathA = path.join(domainDirectory, a);
      const pathB = path.join(domainDirectory, b);
      return fs.statSync(pathB).mtime.getTime() - fs.statSync(pathA).mtime.getTime();
    });

    let latestDifferences = '';
    let diffFileNames = [];

    // Check if there are any diff files
    if (diffFiles.length > 0) {
      const latestDifferencesFilePath = path.join(domainDirectory, diffFiles[0]);
      latestDifferences = fs.existsSync(latestDifferencesFilePath)
        ? fs.readFileSync(latestDifferencesFilePath, 'utf-8')
        : '';

      diffFileNames = diffFiles.map(fileName => path.join(fileName));

    }

    if (file && file !== ''){
      const filePath = path.join(domainDirectory, file)
      const getFile = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : 'File Not Found!';
      res.json({ savedHtml, getFile, diffFileNames });
      return
    }

    res.json({ savedHtml, latestDifferences, diffFileNames });
  } catch (error) {
    console.error('Error reading files:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// getDomainName
function getDomainName(urlString) {
  try {
    const parsedUrl = new URL(urlString);
    return parsedUrl.hostname;
  } catch (error) {
    console.error(`Error parsing URL: ${error.message}`);
    return null;
  }
}

// Getting endpoint path
function getEndpointPath(urlString) {
  const parsedUrl = new URL(urlString);
  const pathSegments = parsedUrl.pathname.split('/').filter(Boolean); // Remove empty segments

  // If there are path segments, join them with underscores
  // Otherwise, use a default underscore
  const endpointPath = pathSegments.length > 0
    ? '_' + pathSegments.join('_')
    : '_';

  return endpointPath;
}

module.exports = {getAllMonitor, updateMonitor, deleteMonitor, displayMonitor}
