const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

const folderPath = '/home/kali/Desktop/my_tools/framework/recon';


const metadata = async (req, res) => {
    try {
        const fdirectories = await getDirectories();
        const domainData = await getLatestNewUrlsForAllDomains(); // Get latest URLs and counts
        res.status(200).json({ directories: fdirectories, domainData });
    } catch (error) {
        res.status(500).json({ error: `Unable to read directories: ${error.message}` });
    }
};





const getDirectories = async () => {
    try {
      const directories = await fs.promises.readdir(folderPath);
      
      const results = await Promise.all(directories.map(async (dir) => {
        const domainPath = path.join(folderPath, dir);
        const stats = await fs.promises.stat(domainPath);

        if (stats.isDirectory()) {
          return { domain: dir, fullPath: domainPath }; // Return both name and full path
        }
      }));
  
      const filteredResults = results.filter(result => result !== undefined);

      return filteredResults;
    } catch (err) {
      throw new Error(`Unable to read directories: ${err.message}`);
    }
  };

// Function to get latest 3 new_urls files for each domain directory
const getLatestNewUrlsForAllDomains = async () => {
    try {
        const directories = await getDirectories();
        const results = await Promise.all(directories.map(async ({ domain, fullPath }) => {
            const latestNewUrlsFiles = await getLastNewUrlsFiles(path.join(fullPath, 'urls'), 3);
            return { domain, fullPath, latestNewUrlsFiles }; 
        }));

        return results;
    } catch (err) {
        throw new Error(`Unable to get latest new_urls files: ${err.message}`);
    }
};


const getLastNewUrlsFiles = async (urlsFolderPath, count = 3) => {
    try {
        const newUrlsFolderPath = path.join(urlsFolderPath, 'new_urls');
        if (!fs.existsSync(newUrlsFolderPath)) {
            console.warn(`Folder does not exist: ${newUrlsFolderPath}`);
            return [];
        }

        const files = await fs.promises.readdir(newUrlsFolderPath);
        const newUrlFiles = files.filter(file => file.startsWith('new_urls_'));
        return newUrlFiles.sort((a, b) => b.localeCompare(a)).slice(0, count);
    } catch (err) {
        throw new Error(`Unable to get new_urls files: ${err.message}`);
    }
};
  


const streamLatestNewUrls = async (res, page = 1, limit = 50) => {
    try {
        const domainsData = await getLatestNewUrlsForAllDomains(); // Get latest new_urls files for all domains
        res.setHeader('Content-Type', 'application/x-ndjson'); // Set header for NDJSON format

        let totalFiles = 0;
        const allFiles = [];

        // Collect all the files for streaming later
        for (const domain of domainsData) {
            const { fullPath, latestNewUrlsFiles } = domain;
            if (latestNewUrlsFiles.length > 0) {
                for (const file of latestNewUrlsFiles) {
                    const filePath = path.join(fullPath, 'urls', 'new_urls', file);
                    allFiles.push(filePath);
                }
            }
        }

        let currentLine = 0;
        const startLine = (page - 1) * limit;
        const endLine = startLine + limit;

        let fileIndex = 0;
        let linesStreamed = 0;

        const streamFile = (filePath) => {
            if (!fs.existsSync(filePath)) {
                fileIndex++;
                if (fileIndex >= allFiles.length) {
                    res.end(); // End response if no more files
                } else {
                    streamFile(allFiles[fileIndex]); // Move to the next file
                }
                return;
            }

            const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                if (currentLine >= startLine && currentLine < endLine && line.trim()) {
                    res.write(JSON.stringify({ url: line }) + '\n'); // Write the line to the response
                    linesStreamed++;
                }

                if (currentLine >= endLine || linesStreamed >= limit) {
                    rl.close(); // Stop reading once we've streamed enough lines
                }

                currentLine++;
            });

            rl.on('close', () => {
                if (linesStreamed >= limit || fileIndex >= allFiles.length - 1) {
                    res.end(); // End response after limit is reached or all files are processed
                } else {
                    fileIndex++;
                    streamFile(allFiles[fileIndex]); // Move to the next file
                }
            });

            rl.on('error', (err) => {
                console.error(`Error reading file ${filePath}:`, err);
                fileIndex++;
                if (fileIndex >= allFiles.length) {
                    res.end(); // End response after all files are processed
                } else {
                    streamFile(allFiles[fileIndex]); // Move to the next file
                }
            });
        };

        if (allFiles.length > 0) {
            streamFile(allFiles[0]); // Start streaming from the first file
        } else {
            res.end(); // End response if no files are found
        }
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
    
    if (!domain) {
        
        await streamLatestNewUrls(res, page, limit); // Stream URLs for all domains
        
        
        
    } else {
        try {
            res.setHeader('Content-Type', 'application/x-ndjson');
            // Set the header for NDJSON streaming response
            await streamUrlsFromNewFiles(res, domain, folderPath, page, limit); // Stream URLs from last 5 new_urls files in NDJSON format
        } catch (err) {
            res.status(500).json({ error: `Unable to stream URLs for domain ${domain}: ${err.message}` });
        }
    }
};



const getInterestingWords = async (req, res) => {
    try {
        const keywordsFilePath = path.join(__dirname, 'keywords.txt'); // Path to the keywords file
        const keywordsData = await fs.promises.readFile(keywordsFilePath, 'utf8'); // Read the file

        const keywordsArray = keywordsData.split('\n').map(word => word.trim()).filter(Boolean); // Split by line and trim

        // Create an array of objects, each containing the keyword
        const keywordsJson = keywordsArray.map(word => ({ word: word }));

        res.status(200).json(keywordsJson); // Send the JSON response
    } catch (error) {
        console.error(`Error reading keywords file:`, error);
        res.status(500).json({ error: `Unable to read keywords file: ${error.message}` });
    }
};

module.exports = { getDomains, metadata, getInterestingWords };
