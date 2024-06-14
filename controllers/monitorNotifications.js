const fs = require('fs');
const path = require('path');
const connection = require('../db/mysql')


const getUnreadFiles = async (req, res) => {


    let url = req.query.url;

    if(!url){
        try {
            connection.execute(
                'SELECT * FROM `notifications`',

                function(err, results, fields) {
        
                    res.status(200).json(results);
                    
                }
            );
        } catch (error) {
        console.error(error); 
        }
    }else{

        try {
            connection.execute(
                'SELECT * FROM `notifications` WHERE `base_url` = ? ',
                [url],
                function(err, results, fields) {
        
                    res.status(200).json(results);
                    
                }
            );
        } catch (error) {
        console.error(error); 
        }
    }
}

const deleteReadFiles = async (req, res) => {
    let path = req.query.path;
  
    if (path) {
      try {
        const decodedPath = decodeURIComponent(path);
        connection.execute(
          'DELETE FROM `notifications` WHERE path=?',
          [decodedPath],
          function(err, results, fields) {
            if (err) {
              console.error('Error updating data:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ success: "Path Deleted Successfully" });
          }
        );
      } catch (error) {
        res.status(500).json({ Error: error });
      }
    }
  };
  



module.exports = {getUnreadFiles, deleteReadFiles}