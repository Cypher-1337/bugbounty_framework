const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

const folderPath = '/home/kali/Desktop/my_tools/framework/recon';


// Function to get the last 3 new_urls files for all domains
const getAllDomainsNewUrls = async (res) => {
    try {
        const directories = await fs.promises.readdir(folderPath);
        const results = await Promise.all(directories.map(async (dir) => {
            const domainPath = path.join(folderPath, dir);
            const stats = await fs.promises.stat(domainPath);
            if (stats.isDirectory()) {
                // Check for new_urls within the domain's urls directory
                const urlsFolderPath = path.join(domainPath, 'urls');
                const lastNewUrlsFiles = await getLastNewUrlsFiles(urlsFolderPath, 3); // Get last 3 new_urls files

                // Only return the domain if it has new URLs files
                if (lastNewUrlsFiles.length > 0) {
                    return { domain: dir, newUrlsFiles: lastNewUrlsFiles };
                }
            }
        }));

        // Filter out undefined results (in case of non-directory entries)
        const filteredResults = results.filter(result => result !== undefined);

        res.json({
            domains: filteredResults
        });
    } catch (err) {
        res.status(500).json({ error: `Unable to read directories: ${err.message}` });
    }
};


// Helper function to get the last N new_urls files in a directory
const getLastNewUrlsFiles = async (urlsFolderPath, count = 5) => {
    try {
        const newUrlsFolderPath = path.join(urlsFolderPath, 'new_urls');

        // Check if the new_urls folder exists
        if (!fs.existsSync(newUrlsFolderPath)) {
            return [];
        }

        const files = await fs.promises.readdir(newUrlsFolderPath);

        // Filter for files matching the 'new_urls_' naming pattern
        const newUrlFiles = files.filter(file => file.startsWith('new_urls_'));

        // Sort files by name (assuming filenames include the date-time info)
        const sortedFiles = newUrlFiles.sort((a, b) => b.localeCompare(a));

        // Return the last N files
        return sortedFiles.slice(0, count);
    } catch (err) {
        throw new Error(`Unable to get new_urls files: ${err.message}`);
    }
};

// Function to stream URLs from the last 5 new_urls files in NDJSON format
const streamUrlsFromNewFiles = async (res, domain, dirPath, page, limit) => {
    try {
        const urlsFolderPath = path.join(dirPath, domain, 'urls');
        const lastNewUrlsFiles = await getLastNewUrlsFiles(urlsFolderPath);

        console.log(`Last new_urls files for ${domain}:`, lastNewUrlsFiles); // Log the files being processed

        if (lastNewUrlsFiles.length === 0) {
            res.status(404).json({ error: 'No new_urls files found' });
            return;
        }

        let currentLine = 0;
        const startLine = (page - 1) * limit;
        const endLine = startLine + limit;
        let fileIndex = 0;

        const readNextFile = () => {
            if (fileIndex >= lastNewUrlsFiles.length) {
                res.end();
                return;
            }

            const filePath = path.join(urlsFolderPath, 'new_urls', lastNewUrlsFiles[fileIndex]);
            const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                if (currentLine >= startLine && currentLine < endLine) {
                    res.write(JSON.stringify({ url: line }) + '\n');
                }

                if (currentLine >= endLine) {
                    rl.close();
                }

                currentLine++;
            });

            rl.on('close', () => {
                fileIndex++;
                if (currentLine < endLine) {
                    readNextFile();
                } else {
                    res.end();
                }
            });

            rl.on('error', (err) => {
                console.error(`Error reading file ${filePath}:`, err); // Log any errors
                res.status(500).json({ error: `Unable to read URLs: ${err.message}` });
            });
        };

        readNextFile();
    } catch (err) {
        console.error(`Error streaming URLs for ${domain}:`, err); // Log the error
        res.status(500).json({ error: `Unable to stream URLs: ${err.message}` });
    }
};



// Function to handle GET request and stream NDJSON data
const getDomains = async (req, res) => {
    const domain = req.query.domain;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 50; // Default to 50 URLs per chunk

    if (!domain) {
        if (req.path === '/api/v1/endpoints') {
            // If the request is for /api/v1/endpoints without parameters
            await getAllDomainsNewUrls(res);
        } else {
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
        }
    } else {
        try {
            // Set the header for NDJSON streaming response
            res.setHeader('Content-Type', 'application/x-ndjson');
            await streamUrlsFromNewFiles(res, domain, folderPath, page, limit); // Stream URLs from last 5 new_urls files in NDJSON format
        } catch (err) {
            res.status(500).json({ error: `Unable to stream URLs for domain ${domain}: ${err.message}` });
        }
    }
};

module.exports = { getDomains };
