const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

const folderPath = '/home/kali/Desktop/my_tools/framework/recon';


const metadata = async (req,res) => {
    try {
        fdirectories =  await getDirectories()
        res.status(200).json({directories: fdirectories})

    } catch (error) {
     res.status(500).json({ error: `Unable to read directories: ${err.message}` });
        
    }
}

const getDirectories = async () => {
 try{    // await getAllDomainsNewUrls(res);

     const directories = await fs.promises.readdir(folderPath);
     const results = await Promise.all(directories.map(async (dir) => {
         const domainPath = path.join(folderPath, dir);
         const stats = await fs.promises.stat(domainPath);
         if (stats.isDirectory()) {
            return { domain: dir, fullPath: domainPath }; // Return both name and full path
        }
     }));

     // Filter out undefined results (in case of non-directory entries)
     const filteredResults = results.filter(result => result !== undefined);

     return filteredResults
 } catch (err) {
     res.status(500).json({ error: `Unable to read directories: ${err.message}` });
 }
}

// Function to get latest 3 new_urls files for each domain directory
const getLatestNewUrlsForAllDomains = async () => {
    try {
        const directories = await getDirectories();
        const results = await Promise.all(directories.map(async ({ domain, fullPath }) => {
            const latestNewUrlsFiles = await getLastNewUrlsFiles(path.join(fullPath, 'urls'), 3);
            return { fullPath, latestNewUrlsFiles };
        }));

        return results;
    } catch (err) {
        throw new Error(`Unable to get latest new_urls files: ${err.message}`);
    }
};


// Helper function to get the last N new_urls files in a directory
const getLastNewUrlsFiles = async (urlsFolderPath, count = 5) => {
    try {
        const newUrlsFolderPath = path.join(urlsFolderPath, 'new_urls');

        console.log(`Checking new_urls folder: ${newUrlsFolderPath}`); // Debug log

        if (!fs.existsSync(newUrlsFolderPath)) {
            console.warn(`Folder does not exist: ${newUrlsFolderPath}`); // Debug log
            return [];
        }

        const files = await fs.promises.readdir(newUrlsFolderPath);

        console.log(`Files found: ${files}`); // Log files in the folder

        const newUrlFiles = files.filter(file => file.startsWith('new_urls_'));

        console.log(`Filtered new_urls files: ${newUrlFiles}`); // Log filtered files

        const sortedFiles = newUrlFiles.sort((a, b) => b.localeCompare(a));

        return sortedFiles.slice(0, count);
    } catch (err) {
        throw new Error(`Unable to get new_urls files: ${err.message}`);
    }
};



// Function to stream the latest 3 new_urls files for all domains
const streamLatestNewUrls = async (res) => {
    try {
        const domainsData = await getLatestNewUrlsForAllDomains(); // Get the latest new_urls files

        for (const domain of domainsData) {
            const { fullPath, latestNewUrlsFiles } = domain;

            // Filter to get the latest 3 files if available
            const filesToStream = latestNewUrlsFiles.slice(0, 3);
            console.log(`Streaming files for domain: ${fullPath}`);

            for (const file of filesToStream) {
                const filePath = path.join(fullPath, 'urls', 'new_urls', file);

                // Check if the file exists
                if (fs.existsSync(filePath)) {
                    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
                    const rl = readline.createInterface({
                        input: readStream,
                        crlfDelay: Infinity
                    });

                    rl.on('line', (line) => {
                        console.log(`Read line: ${line}`); // Debug log
                        if (line.trim() === '') {
                            console.warn(`Empty line found in file: ${filePath}`); // Log empty line
                            return; // Skip empty lines
                        }
                        res.write(JSON.stringify({ url: line }) + '\n');
                    });

                    rl.on('close', () => {
                        console.log(`Finished streaming file: ${filePath}`);
                    });

                    rl.on('error', (err) => {
                        console.error(`Error reading file ${filePath}:`, err);
                        res.status(500).json({ error: `Unable to read URLs: ${err.message}` });
                    });
                } else {
                    console.warn(`File not found: ${filePath}`);
                }
            }
        }

        res.end(); // End the response after all domains are processed
    } catch (error) {
        console.error(`Error streaming latest new_urls files:`, error);
        if (!res.headersSent) {
            res.status(500).json({ error: `Unable to stream latest new_urls files: ${error.message}` });
        }
    }
};



// Function to stream URLs from the last 5 new_urls files in NDJSON format
const streamUrlsFromNewFiles = async (res, domain, dirPath, page, limit) => {
    try {
        const urlsFolderPath = path.join(dirPath, domain, 'urls');
        const lastNewUrlsFiles = await getLastNewUrlsFiles(urlsFolderPath);

        console.log(`Last new_urls files for ${domain}:`, lastNewUrlsFiles); // Log the files being processed

        if (lastNewUrlsFiles.length === 0) {
            console.log(`No new_urls files found for ${domain}. Skipping...`); // Log that this domain is being skipped
            return; // Skip processing for this domain
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
    res.setHeader('Content-Type', 'application/x-ndjson');

    if (!domain) {

        await streamLatestNewUrls(res); // Stream URLs for all domains
 
        

    } else {
        try {
            // Set the header for NDJSON streaming response
            await streamUrlsFromNewFiles(res, domain, folderPath, page, limit); // Stream URLs from last 5 new_urls files in NDJSON format
        } catch (err) {
            res.status(500).json({ error: `Unable to stream URLs for domain ${domain}: ${err.message}` });
        }
    }
};

module.exports = { getDomains, metadata };
