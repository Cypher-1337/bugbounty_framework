const express = require('express');
const router = express.Router();
const domainController = require('../controllers/reconController');

router.post('/', async (req, res) => {
  const domain = req.body.domain;

  // Validate domain and handle it accordingly

  // Add the domain to the queue
  domainController.domainQueue.push(domain);

  // If the queue is not currently being processed, start processing
  if (domainController.domainQueue.length === 1) {
    try {
      // Start processing the domain
      await domainController.processNextDomain(res);
    } catch (error) {
      console.error('Error processing domain:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.send('Domain added to the queue for processing');
  }
});


router.get('/queue', (req, res) => {
  const queueStatus = domainController.getDomainQueue();
  res.json({ queueStatus });
});

module.exports = router;
