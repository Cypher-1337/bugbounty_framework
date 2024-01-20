const express = require('express');
const router = express.Router();
const { runningMonitor } = require('../monitor/monitorOps'); // Update the path
const { getAllMonitor, deleteMonitor, updateMonitor, displayMonitor } = require('../controllers/monitorController')


router.route('/add')
  .get((req, res) => {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }



    runningMonitor(url);
    res.status(200).json({ message: 'Monitoring script executed.' });
  });

router.route('/')
  .get(getAllMonitor)
  .post(updateMonitor)

router.route('/display')
  .get(displayMonitor)
  
router.route('/delete/:id')
  .delete(deleteMonitor)

module.exports = router;
