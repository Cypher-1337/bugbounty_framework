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

const addMonitor = async (req, res) => {
  try {
  
    const url = req.query.url;

    connection.execute(
      `Insert into monitor (url, monitor) values(?,10);`,
      [url],
      function(err, results, fields) {
        if (err) {
          console.error('Error updating data:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json("Monitor Added Successfully");
      }
    );

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  
  }
}

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
 
  let file = '';
  if(req.query.file){
    file = req.query.file
  }

  const parsedUrl = new URL(url);



  const savedFolder = path.join('/home/kali/Desktop/my_tools/html_monitor_project/results', parsedUrl.hostname, parsedUrl.pathname);

  if (file){

    // This try solve the probelm that if you requested non existed file it won't break the code
    try{

      let fileContent = getFileContent(file)


      let dir = path.dirname(file) + '/';

      let newFiles = [];

      // if the file doen't start with ( new_ )
      if(!path.basename(file).startsWith("new_")){

        newFiles = listNewFiles(dir, file)
        res.status(200).json({fileContent, newFiles})
      
      }else{ /* if the file start with ( new_ ) */

        // remove the new_{DATE} & .txt 
        const match = file.match(/new_\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_(.*)\.txt$/);
        const extractedFile = match ? match[1] : '';
        // extractedFile  eg(main.js)

        newFiles = listNewFiles(dir, extractedFile)

        res.status(200).json({fileContent, newFiles});

      }

    } catch (err) {
      res.status(500).json({Error: err.message})
    }
   

  }

  else{

    try{
      const files = listFiles(savedFolder);
      res.status(200).json({savedFolder, files})
    } catch (err){
      res.status(500).json({error:"Failed to read Direcotry", details: err.message})
    } 

  }

  
};

function listFiles(dir, fileList = []){
  let files = fs.readdirSync(dir);

  files.forEach((file) => {
    let filePath = path.join(dir, file);
    if(fs.statSync(filePath).isDirectory()){
      listFiles(filePath, fileList)
    }else{
       // Exclude files starting with 'new_' from the list
      if (!file.startsWith('new_')) {
        fileList.push(filePath);
      }
    }
  })

  return fileList
}



function getFileContent(file) {
  if (!fs.existsSync(file)) {
    throw new Error("File not found");
  }
  return fs.readFileSync(file, 'utf8');
}



function listNewFiles(dir, filename, fileList = []) {
  let files = fs.readdirSync(dir);

  files.forEach((file) => {
      if (file.startsWith('new_') && file.includes(filename.split('/').pop())) {
        fileList.push(dir + file);
      }
  });

  return fileList;
}



module.exports = {getAllMonitor, updateMonitor, deleteMonitor, displayMonitor, addMonitor}
