const express = require('express');
const router = express.Router();
const connection = require('../db/mysql')



router.get('/', (req, res) => {
  
  try{
    connection.execute(
      'SELECT * FROM `notifications` order by id desc',
      function(err, results, fields) {

        
        res.json(results);

        
      }
    );
  } catch{
    console.log("Error getting the notifications")
  }
  
}); 


router.delete('/', (req, res) => {
  
  const id = req.query.id;

  try{
    connection.execute(
      `DELETE FROM notifications WHERE id=?`,
      [id],
      function(err, results, fields) {

        
        res.json(results);

        
      }
    );
  } catch{
    console.log("Error Deleting notifications")
  }
  
}); 



  module.exports = router;
