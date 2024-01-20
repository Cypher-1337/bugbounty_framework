const fs = require('fs');
const axios = require('axios');

const targetUrl = 'https://assets-bundle.clouddam.microsoft.com'; // Replace with your target URL
const wordlistFilePath = '/home/kali/Desktop/wordlist/dirsearch.txt'; // Replace with the path to your wordlist file (with 1000 words)

const isCustom404 = (response) => {
  // Add conditions to identify custom 404 pages based on response content or headers
  // For example, check if the response body contains a specific string or header
  return response.status === 200 && response.data.includes('Custom 404 Page');
};

async function fuzzDirectories() {
  try {
    const wordlist = fs.readFileSync(wordlistFilePath, 'utf-8').split('\n').map(line => line.trim());

    // Adjust the concurrency level based on your testing needs
    const concurrency = 100; // You can experiment with different values

    // Split the wordlist into chunks to run concurrently
    const wordlistChunks = Array.from({ length: Math.ceil(wordlist.length / concurrency) }, (v, i) =>
      wordlist.slice(i * concurrency, i * concurrency + concurrency)
    );

    // Use Promise.all to run multiple chunks concurrently
    await Promise.all(
      wordlistChunks.map(async (chunk) => {
        await Promise.all(
          chunk.map(async (directory) => {
            const url = `${targetUrl}/${directory}`;

            try {
              const response = await axios.head(url);

              if (!isCustom404(response)) {
                const statusCode = response.status;
                const contentSize = response.headers['content-length'];

                console.log(`${url} | Status Code: ${statusCode} | Size: ${contentSize || 'N/A'}`);
              }
            } catch (error) {
              if (!(error.response && error.response.status === 404)) {
                console.error(`[!] Error checking ${url}: ${error.message}`);
              }
            }
          })
        );
      })
    );
  } catch (err) {
    console.error(`[!] Error reading wordlist file: ${err.message}`);
  }
}

fuzzDirectories();