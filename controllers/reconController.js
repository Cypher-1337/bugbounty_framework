const { exec } = require('child_process');
const createNotification = require('../notification/notification')

let domainQueue = [];

const processDomain = (domain) => {
  return new Promise((resolve, reject) => {

    
    createNotification("notification", `[*] Running recon.sh against the ${domain}`);

    const command = `recon.sh -d ${domain} -r`;

    exec(command, (error, stdout, stderr) => {
      createNotification("notification", `Finish recon.sh on ${domain}`);

      if (error) {
        console.error(`Error executing command for ${domain}: ${error.message}`);
        reject({ error, stdout, stderr });
      } else {
        if (stderr) {
          console.warn(`Command warning for ${domain}: ${stderr}`);
        }

        resolve({ stdout, stderr });
      }
    });
  });
};
 
const processNextDomain = async (res) => {
  if (domainQueue.length === 0) {
    console.log("No more domains")
    return;
  }

  const nextDomain = domainQueue[0];

  try {

    // Wait for processDomain to complete before moving to the next domain
    const result = await processDomain(nextDomain);

    // Remove the processed domain from the queue
    domainQueue.shift();

 
    // Process the next domain in the queue (if any)
    processNextDomain(res);


  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);

  }
};
 
const getDomainQueue = () => {
  return domainQueue;
};

module.exports = { processDomain, processNextDomain, getDomainQueue, domainQueue };
