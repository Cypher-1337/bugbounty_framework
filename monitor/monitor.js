const axios = require('axios');
const fs = require('fs');
const diff = require('diff');
const url = require('url');
const path = require('path');
const beautify = require('js-beautify').html;
const https = require('https');  // Add this line to import the 'https' module
const connection = require('../db/mysql'); // Import your MySQL connection
const createNotification = require('../notification/notification')


// Add the following line to disable SSL certificate validation
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;



const ignoredPatterns = [
  /<meta[^>]*>/g,  // Match and remove all meta tags
  /<meta name="csrf-token" content=".*">/g,
  /window\.livewire_token = '.*';/g,
  /<input type="hidden" name="_token" value=".*">/g,  // CSRF token in a hidden input
  /<input type="hidden" name="__RequestVerificationToken" value=".*">/g,  // CSRF token in a hidden input (ASP.NET)
  /<input type="hidden" name="__VIEWSTATE" value=".*">/g,  // ViewState in a hidden input (ASP.NET)
  /<input type="hidden" name="__EVENTVALIDATION" value=".*">/g,  // Event Validation in a hidden input (ASP.NET)
  /<input type="hidden" name="__VIEWSTATEGENERATOR" value=".*">/g,  // ViewState Generator in a hidden input (ASP.NET)
  /<input type="hidden" name="__PREVIOUSPAGE" value=".*">/g,  // Previous Page ID in a hidden input (ASP.NET)
  /<input type="hidden" name="__ASYNCPOST" value=".*">/g,  // Async Postback indicator in a hidden input (ASP.NET)
  /<input type="hidden" name="__EVENTTARGET" value=".*">/g,  // Event Target in a hidden input (ASP.NET)
  /<input type="hidden" name="__EVENTARGUMENT" value=".*">/g,  // Event Argument in a hidden input (ASP.NET)
  /<input[^>]+name=["']?_csrf["']?[^>]*>/g,  // Common _csrf input field
  /<input[^>]+name=["']?csrf_token["']?[^>]*>/g,  // Common csrf_token input field
  /<input[^>]+name=["']?antiForgeryToken["']?[^>]*>/g,  // Common antiForgeryToken input field
  /<style[^>]*>[\s\S]*?<\/style>/g,  // Style tags
  /<link[^>]+rel=["']?stylesheet["']?[^>]*>/g,  // Stylesheet links
  /data-v-[a-zA-Z0-9]+/g,  // Vue.js data attribute
];

function ignorePatterns(content) {
  return ignoredPatterns.reduce((result, pattern) => {
    // Replace each matched pattern with an empty string
    return result.replace(pattern, '');
  }, content);
}

function fetchHtmlContent(url) {

  return axios.get(url, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
      .then(response => {
      if (typeof response.data === 'object' && response.data !== null) {
        return JSON.stringify(response.data);
      }
      return response.data;
    })
    .then(htmlContent => beautify(htmlContent, { indent_size: 2 })) // Beautify the HTML content
    .then(beautifiedHtml => {



      return beautifiedHtml;
    })
    .catch(error => {
      console.error(`Error fetching content from ${url}:`, error.message);
      return ''; // Return an empty string in case of an error
    });

}

function saveContentToFile(content, filePath) {
  try {
    if (typeof content !== 'string') {
      console.error(`Content is not a string. Type: ${typeof content}`);
      return;
    }

    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    console.error(`Error saving content to file ${filePath}:`, error.message);
  }
}


function printDifference(savedContent, currentContent) {
  const differences = diff.diffLines(savedContent, currentContent);

  const changedLines = differences
    .filter(part => part.added || part.removed)
    .map(part => part.value)
    .join('');

  // Use js-beautify to format the HTML
  return beautify(changedLines, { indent_size: 2 });
}

function compareSavedContent(websiteUrl) {
  const savedFolder = `/home/kali/Desktop/saved_content/${getDomainName(websiteUrl)}`;
  const endpointPath = getEndpointPath(websiteUrl);
  const domainDirectory = path.join(savedFolder, endpointPath);
  const savedHtmlPath = path.join(domainDirectory, `saved_html${endpointPath}.txt`);
  const currentDate = new Date().toISOString().replace(/:/g, '-').substring(0, 19);
  const differencesFilePath = path.join(domainDirectory, `${currentDate}_diff${endpointPath}.txt`);


  // Read the content of the saved_html.txt file if it exists
  let savedHtml = '';
  try {
    savedHtml = fs.existsSync(savedHtmlPath) ? fs.readFileSync(savedHtmlPath, 'utf-8') : '';
  } catch (error) {
    console.error(`Error reading saved_html.txt file: ${error.message}`);
  }

  fetchHtmlContent(websiteUrl)
    .then(currentHtml => {
      // Ignore specific patterns in HTML content
      const ignoredSavedHtml = ignorePatterns(savedHtml);
      const ignoredCurrentHtml = ignorePatterns(currentHtml);

      // Save the current HTML content to the saved_html.txt file
      saveContentToFile(currentHtml, savedHtmlPath);

      let differencesOutput = '';

      // Check for differences only if ignoredSavedHtml is not empty
      if (ignoredSavedHtml.trim() !== '') {
        const formattedOutput = printDifference(ignoredSavedHtml, ignoredCurrentHtml);

        if (formattedOutput.trim() !== '') {
          differencesOutput += '' + formattedOutput + '\n';
          increaseCount(websiteUrl)
            .then(updatedCount => console.log(`Count increased to ${updatedCount}`))
            .catch(error => console.error('Error increasing count:', error));
        }
      }

      // Save differences to a file
      if (differencesOutput) {
        fs.writeFileSync(differencesFilePath, differencesOutput, 'utf-8');
        // createNotification("notification", `[+] Change detected in ${websiteUrl}`)
      }
    })
    .catch(error => console.error('Error:', error));
}

// Getting domain name
function getDomainName(urlString) {
  try {
    const parsedUrl = new URL(urlString);
    return parsedUrl.hostname;
  } catch (error) {
    console.error(`Error parsing URL: ${error.message}`);
    return null;
  }
}

// Getting endpoint path
function getEndpointPath(urlString) {
  const parsedUrl = new URL(urlString);
  const pathSegments = parsedUrl.pathname.split('/').filter(Boolean); // Remove empty segments

  // If there are path segments, join them with underscores
  // Otherwise, use a default underscore
  const endpointPath = pathSegments.length > 0
    ? '_' + pathSegments.join('_')
    : '_';

  return endpointPath;
}


// increase count by 1 if there is change detected 
function increaseCount(url) {
  return new Promise((resolve, reject) => {
    // Step 1: Retrieve the current count value
    connection.query('SELECT count FROM monitor WHERE url = ?', [url], (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      // Check if the URL exists in the monitor table
      if (results.length === 0) {
        reject(new Error('URL not found'));
        return;
      }

      // Get the current count value
      const currentCount = results[0].count;

      // Step 2: Update the count by incrementing it by 1
      const updatedCount = currentCount + 1;

      connection.query('UPDATE monitor SET count = ?, date = NOW() WHERE url = ?', [updatedCount, url], (updateError, updateResults) => {
        if (updateError) {
          reject(updateError);
        } else {
          resolve(updatedCount);
        }
      });
    });
  });
}


module.exports = { compareSavedContent };
