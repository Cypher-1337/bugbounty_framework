const connection = require("../../db/mysql");
const path = require('path');
const fs = require('fs');

const getFuzzedSubdomains = () => {
    return new Promise((resolve, reject) => {
        connection.execute(
            'SELECT id, alive, directories_found FROM `live` where fuzz>=1 ',
            function(err, results, fields) {
                if (err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
}

const fuzz = async (req, res) => {
    try {
        const results = await getFuzzedSubdomains();
        res.json(results);
    } catch (error) {
        console.error('Error getting data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getReport = async (req, res) => {
    const subdomain = req.params.subdomain;
    const safeSubdomain = subdomain.replace("://", "_").replace(".", "_").replace("/", "_");
    const reportDir = path.join('/', 'home', 'kali', 'fuzzing_automation', 'fuzzing_results'); // Adjust path if needed

    // Find the latest report file for the subdomain
    fs.readdir(reportDir, (err, files) => {
        if (err) {
            console.error('Error reading report directory:', err);
            return res.status(500).send('Error reading reports');
        }

        const reportRegex = new RegExp(`report_${safeSubdomain}_(.*)\\.html`);
        const matchingReports = files.filter(file => reportRegex.test(file));

        if (matchingReports.length === 0) {
            return res.status(404).send(`Report not found ${reportRegex}`);
        }

        // Assuming the latest report is the one with the most recent timestamp
        // You might need a more robust way to determine the "latest" if filenames aren't strictly timestamped
        const latestReport = matchingReports.sort().pop();
        const reportPath = path.join(reportDir, latestReport);

        // Send the report file
        res.sendFile(reportPath);
    });
};

module.exports = { fuzz, getReport };