const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

const folderPath = '/home/kali/framework/recon';

// Function to read the file and stream URLs in NDJSON format
const streamUrlsAsNDJSON = (res, domain, dirPath, page, limit) => {
    const urlsFolderPath = path.join(dirPath, domain, 'urls');
    const filePath = path.join(urlsFolderPath, 'all_urls.txt');

    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    let currentLine = 0;
    const startLine = (page - 1) * limit;
    const endLine = startLine + limit;

    rl.on('line', (line) => {
        if (currentLine >= startLine && currentLine < endLine) {
            // Send each URL as an NDJSON line (newline-delimited JSON)
            res.write(JSON.stringify({ url: line }) + '\n');
        }

        if (currentLine >= endLine) {
            rl.close(); // Stop reading when the limit is reached
        }

        currentLine++;
    });

    rl.on('close', () => {
        res.end(); // End the stream after sending all URLs
    });

    rl.on('error', (err) => {
        res.status(500).json({ error: `Unable to read URLs: ${err.message}` });
    });
};

// Function to handle GET request and stream NDJSON data
const getDomains = async (req, res) => {
    const domain = req.query.domain;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 50; // Default to 50 URLs per chunk

    if (!domain) {
        try {
            const directories = await fs.promises.readdir(folderPath);
            const results = await Promise.all(directories.map(async (dir) => {
                const domainPath = path.join(folderPath, dir);
                const stats = await fs.promises.stat(domainPath);
                if (stats.isDirectory()) {
                    return { domain: dir };
                }
            }));

            // Filter out undefined results (in case of non-directory entries)
            const filteredResults = results.filter(result => result !== undefined);

            res.json({
                directories: filteredResults
            });
        } catch (err) {
            res.status(500).json({ error: `Unable to read directories: ${err.message}` });
        }
    } else {
        try {
            // Set the header for NDJSON streaming response
            res.setHeader('Content-Type', 'application/x-ndjson');
            streamUrlsAsNDJSON(res, domain, folderPath, page, limit); // Stream URLs in NDJSON format
        } catch (err) {
            res.status(500).json({ error: `Unable to stream URLs for domain ${domain}: ${err.message}` });
        }
    }
};

module.exports = { getDomains };
