const connection = require('../db/mysql')


const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};


const getAllSubdomains = async (req, res) => {

  try {
    // Read the 'limit' query parameter with a default value of 500
    const limit = parseInt(req.query.limit, 10) || 10000;
    const filter = req.query.filter;

    if (filter && filter !== ''){

      connection.execute(
        'SELECT * FROM `subdomains` WHERE `subdomain` like ? order by id desc',
        [`%${filter}%`],
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
        `SELECT * FROM subdomains order by id desc limit ${limit}`,
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


module.exports = {getAllSubdomains}