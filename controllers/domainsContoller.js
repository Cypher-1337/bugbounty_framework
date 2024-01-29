const connection = require('../db/mysql')


const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const getAllDomains = async (req, res) => {

  const id = req.query.id;

  try {

    if (id && id !== ''){

      connection.execute(
        'SELECT * FROM `domains` WHERE `id` = ? ',
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
      connection.query(
          'SELECT * FROM domains',
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

      );
    }

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    
  }

}

const updateDomain = async (req, res) => {
  try {

    // Get the domain details from the request body
    const id = req.body.id;
    const domain = req.body.domain;
    const monitor = req.body.monitor;
    const wayback = req.body.wayback;
    const program = req.body.program;

    connection.execute(
      `UPDATE domains SET domain = ?, monitor = ?, wayback = ?, program = ? WHERE id = ?`,
      [`${domain}`, monitor, wayback, program, id],
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


const deleteDomain = async (req, res) => {
  try {
  
    const id = req.params.id;

    connection.execute(
      `DELETE FROM domains WHERE id=?`,
      [id],
      function(err, results, fields) {
        if (err) {
          console.error('Error updating data:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json("Deleted Successfully");
      }
    );

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  
  }
}

module.exports = {getAllDomains, updateDomain, deleteDomain}