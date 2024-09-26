const connection = require('../../db/mysql')


const getFilters = async (req, res) => {
    try {
        

        
        connection.execute(
            'SELECT * FROM `wayback_filter`',
            function(err, results, fields) {
    
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }


            res.json(results);  

            }
        );

    } catch (error) {
        res.status(500).json({ message: error });
    }

}



const insertFilter = async (req, res) => {

    try {
        
        const { domain, subdomain, filter} = req.body

        // Validate that all parameters are present
        if (!domain || !subdomain || !filter) {
            return res.status(400).json({ message: 'Missing required query parameters' });
        }

        connection.execute(
            'INSERT INTO `wayback_filter` (domain, subdomain, filter) VALUES (?, ?, ?)',
            [domain, subdomain, filter],
            function(err, results) {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                res.status(201).json({ message: 'Filter inserted successfully', id: results.insertId });
            }
        );


    } catch (error) {
        res.status(500).json({ message: error });

    }
}



module.exports = {getFilters, insertFilter}