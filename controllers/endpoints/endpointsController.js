const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

const folderPath = '/home/kali/framework/recon';




// Function to read all lines, reverse them, and then return a chunk of URLs
const getAllUrlsStream = (domain, dirPath, page, limit) => {
    const urlsFolderPath = path.join(dirPath, domain, 'urls');
    const filePath = path.join(urlsFolderPath, 'all_urls.txt');

    return new Promise((resolve, reject) => {
        const allLines = [];

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath, { encoding: 'utf8' }),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            allLines.push(line);  // Store all lines in an array
        });

        rl.on('close', () => {
            // Reverse the array to get the last lines first
            const reversedLines = allLines.reverse();

            // Calculate starting index based on page and limit
            const startLine = (page - 1) * limit;
            const chunk = reversedLines.slice(startLine, startLine + limit); // Slice the chunk

            resolve(chunk);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
};

// Function to get the URLs in chunks for the frontend based on domain, page, and limit
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
                    // Fetch URLs for each domain
                    const urls = await getAllUrlsStream(dir, folderPath, page, limit);
                    return { domain: dir, urls };
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
            const urls = await getAllUrlsStream(domain, folderPath, page, limit);
            res.json({
                domain,
                page,
                limit,
                urls, // Send the chunk of URLs
            });
        } catch (err) {
            res.status(500).json({ error: `Unable to read URLs for domain ${domain}: ${err.message}` });
        }
    }
};

module.exports = { getDomains };