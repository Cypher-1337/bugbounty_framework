const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

const folderPath = '/home/kali/Desktop/my_tools/framework/recon';

// Function to read the file and stream a chunk of URLs based on page and limit
const getAllUrlsStream = (domain, dirPath, page, limit) => {
    const urlsFolderPath = path.join(dirPath, domain, 'urls');
    const filePath = path.join(urlsFolderPath, 'all_urls.txt');

    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });

        let currentLine = 0;
        const chunk = [];
        const startLine = (page - 1) * limit;
        const endLine = startLine + limit;

        rl.on('line', (line) => {
            // Reverse the order of lines by pushing to the start of the array
            if (currentLine >= startLine && currentLine < endLine) {
                chunk.unshift(line); // Add the line to the chunk in reverse order
            }

            if (currentLine >= endLine) {
                rl.close(); // Stop reading when we reach the end of the chunk
            }

            currentLine++;
        });

        rl.on('close', () => {
            resolve(chunk); // Resolve with the collected chunk
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
