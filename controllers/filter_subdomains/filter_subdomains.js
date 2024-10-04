const connection = require('../../db/mysql')

const insertFilter = async (req, res) => {
    try {
        // Get the domain details from the request body
        const domain = req.body.domain;
        let subdomain = req.body.subdomain;

        // Add dot before subdomain if it doesn't start with a dot
        if (!subdomain.startsWith('.')) {
            subdomain = `.${subdomain}`;
        }

        connection.execute(
            `INSERT INTO subdomain_filter (domain, subdomain) VALUES (?, ?);`,
            [domain, subdomain],
            function(err, results, fields) {
                if (err) {
                    console.error('Error updating data:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                res.json(`${subdomain} Filter for ${domain}`);
            }
        );
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { insertFilter }
