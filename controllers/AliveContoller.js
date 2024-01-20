const connection = require('../db/mysql')




const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const getAllAlive = async (req, res) => {
  try {
    // Read the 'limit' query parameter with a default value of 500
    const limit = parseInt(req.query.limit, 10) || 10000;
    const filter = req.query.filter;

    

    if (filter && filter !== ''){

      connection.execute(
        'SELECT * FROM `live` WHERE `alive` like ? OR title like ? order by id desc',
        [`%${filter}%`, `%${filter}%`],
        function(err, results, fields) {

          
          // Format the date in each result
          const formattedResults = results.map((result) => ({
            ...result,
            date: formatDateTime(result.date), // Assuming 'date' is the column with the date string
          }));

          res.json(formattedResults);
          
        }
      );


    }else{
      connection.query(
        `SELECT * FROM live order by id desc limit ${limit}`,
        function(err, results, fields) {

          if (err){
            console.log(err)
          }
          
          // Format the date in each result
          const formattedResults = results.map((result) => ({
            ...result,
            date: formatDateTime(result.date), // Assuming 'date' is the column with the date string
          }));

          
          res.json(formattedResults);


        }
      )
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateAlive = async (req, res) => {
  try {

    // Get the domain details from the request body
    const id = req.body.id;
    const alive = req.body.alive;
    const status = req.body.status;
    const size = req.body.size;
    const title = req.body.title;

    connection.execute(
      `UPDATE live SET alive = ?, status = ?, size = ?, title = ? WHERE id = ?`,
      [`${alive}`, status, size, `${title}`, id],
       
      function(err, results, fields) {
        if (err) {
          console.error('Error updating data:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json("Updated Successfully");
      }

    );
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const getAlive = async (req, res) => {

  try {
    
    const id = parseInt(req.params.id, 10)
    
    connection.query(
      `SELECT * FROM live where id=${id}`,
      function(err, results, fields) {

        if (err){
          console.log(err)
        }
        
        // Format the date in each result
        const formattedResults = results.map((result) => ({
          ...result,
          date: formatDateTime(result.date), // Assuming 'date' is the column with the date string
        }));

        res.json(formattedResults);


      }
    )


  } catch (error) {
    res.status(500).json({ message: error });
  }

}

const deleteAlive = async (req, res) => {
  try {
  
    const id = req.params.id;

    connection.execute(
      `DELETE FROM live WHERE id=?`,
      [id],
      function(err, results, fields) {
        if (err) {
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json("Alive Deleted Successfully");
      }
    );

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  
  }
}



module.exports = {getAllAlive, getAlive, updateAlive, deleteAlive}




