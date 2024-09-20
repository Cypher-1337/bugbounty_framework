const fs = require('fs');
const path = require('path');
const readline = require('readline');

const folderPath = '/home/kali/framework/recon';

// Function to get the latest 'new_urls' file for a specific domain
const getLatestNewUrlsFile = (dirPath, callback) => {
    const urlsFolderPath = path.join(dirPath, 'urls', 'new_urls'); // Path to the 'new_urls' folder

    // Check if the new_urls folder exists
    fs.access(urlsFolderPath, fs.constants.F_OK, (err) => {
        if (err) {
            return callback(null, null); // Skip if the directory does not exist
        }

        fs.readdir(urlsFolderPath, (err, files) => {
            if (err) {
                return callback(err, null);
            }

            // Filter to only include files starting with 'new_urls_'
            const newUrlsFiles = files.filter(file => file.startsWith('new_urls_'));

            if (newUrlsFiles.length === 0) {
                return callback(null, null); // No 'new_urls_' files found
            }

            let latestFile = newUrlsFiles[0];
            let latestMtime = fs.statSync(path.join(urlsFolderPath, latestFile)).mtime;

            // Loop through files to find the latest based on modification time
            newUrlsFiles.forEach(file => {
                const filePath = path.join(urlsFolderPath, file);
                const fileMtime = fs.statSync(filePath).mtime;

                if (fileMtime > latestMtime) {
                    latestFile = file;
                    latestMtime = fileMtime;
                }
            });

            callback(null, path.join(urlsFolderPath, latestFile)); // Return full file path of latest 'new_urls' file
        });
    });
};


// Function to read the content of the latest 'new_urls' file and return the URLs

function readUrlsFromFile(filePath, callback) {
    const urls = [];
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        if (urls.length < 100000) { // Limit to 100,000 URLs
            urls.push(line);
        }
    });

    rl.on('close', () => {
        callback(null, urls);
    });

    rl.on('error', (err) => {
        callback(err);
    });
}

// Main function to get the latest 'new_urls' file for each domain and send the URLs to frontend
const getDomains = (req, res) => {

    domain = req.query.domain 

    if( !domain ){
        let directories = [];

        fs.readdir(folderPath, (err, files) => {
            if (err) {
                return res.status(500).json({ error: `Unable to read the folder: ${err}` });
            }

            let pending = files.length; // Number of directories to check

            if (!pending) {
                return res.json({ directories });
            }

            files.forEach(file => {
                const domainPath = path.join(folderPath, file);

                fs.stat(domainPath, (err, stats) => {
                    if (err) {
                        return res.status(500).json({ error: `Unable to get stats for file: ${err}` });
                    }

                    if (stats.isDirectory()) {
                        // Get the latest 'new_urls' file for each domain
                        getLatestNewUrlsFile(domainPath, (err, latestNewUrlsFilePath) => {
                            if (err) {
                                return res.status(500).json({ error: `Unable to get latest new_urls file: ${err}` });
                            }

                            if (latestNewUrlsFilePath) {
                                // Read the URLs from the latest 'new_urls' file
                                readUrlsFromFile(latestNewUrlsFilePath, (err, urls) => {
                                    if (err) {
                                        return res.status(500).json({ error: `Unable to read new_urls file: ${err}` });
                                    }

                                     // Limit the number of URLs to 100,000
                                    const limitedUrls = urls.slice(0, 35000);

                                    directories.push({
                                        domain: file,
                                        latestNewUrlsFile: latestNewUrlsFilePath,
                                        urls: limitedUrls // Array of URLs from the latest file
                                    });

                                    pending--; // Decrement pending count

                                    if (!pending) {
                                        return res.json({ directories });
                                    }
                                });
                            } else {
                                directories.push({
                                    domain: file,
                                    latestNewUrlsFile: 'No new_urls file found',
                                    urls: [] // No URLs
                                });

                                pending--; // Decrement pending count

                                if (!pending) {
                                    return res.json({ directories });
                                }
                            }
                        });
                    } else {
                        pending--; // Decrement pending count for non-directory files

                        if (!pending) {
                            return res.json({ directories });
                        }
                    }
                });
            });
        });

    } else {
        const specificDomainPath = path.join(folderPath, domain, 'urls', 'new_urls');
    
        // Check if the specific domain's new_urls directory exists
        fs.stat(specificDomainPath, (err, stats) => {
            if (err || !stats.isDirectory()) {
                return res.status(404).json({ error: `Domain ${domain} not found` });
            }
    
            // Read all 'new_urls_' files in the specific domain's new_urls directory
            fs.readdir(specificDomainPath, (err, files) => {
                if (err) {
                    return res.status(500).json({ error: `Unable to read new_urls directory: ${err}` });
                }
    
                // Filter to include only files starting with 'new_urls_'
                const newUrlsFiles = files.filter(file => file.startsWith('new_urls_'));
    
                if (newUrlsFiles.length === 0) {
                    return res.json({
                        domain: domain,
                        latestNewUrlsFile: 'No new_urls files found',
                        urls: [] // No URLs
                    });
                }
    
                // Get modification times for sorting
                const fileStatsPromises = newUrlsFiles.map(file => {
                    return new Promise((resolve) => {
                        const filePath = path.join(specificDomainPath, file);
                        fs.stat(filePath, (err, stats) => {
                            if (err) {
                                return resolve({ file, mtime: 0 }); // Use 0 if error
                            }
                            resolve({ file, mtime: stats.mtime });
                        });
                    });
                });
    
                // Wait for all stats to be retrieved
                Promise.all(fileStatsPromises).then(fileStats => {
                    // Sort files by modification time (latest first)
                    fileStats.sort((a, b) => b.mtime - a.mtime);
    
                    // Get the last 5 files (newest)
                    const latestFiles = fileStats.slice(0, 5);
                    const allUrls = [];
                    let pendingFiles = latestFiles.length;
    
                    // Read URLs from each of the latest new_urls files
                    latestFiles.forEach(({ file }) => {
                        const filePath = path.join(specificDomainPath, file);
                        readUrlsFromFile(filePath, (err, urls) => {
                            if (err) {
                                console.error(`Unable to read new_urls file (${file}): ${err}`);
                                pendingFiles--; // Still decrement count even if there's an error
                            } else {
                                allUrls.push(...urls); // Add URLs to the allUrls array
                            }
    
                            pendingFiles--; // Decrement pending count
    
                            if (!pendingFiles) {
                                // Limit the total number of URLs to 100,000
                                const limitedUrls = allUrls.slice(0, 100000);
    
                                return res.json({
                                    domain: domain,
                                    latestNewUrlsFile: latestFiles.map(f => f.file), // Return the latest new_urls files
                                    urls: limitedUrls // Combined array of limited URLs
                                });
                            }
                        });
                    });
                });
            });
        });
    }
    
    
    
};

module.exports = { getDomains };


