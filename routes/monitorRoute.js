const express = require('express');
const router = express.Router();
const { getAllMonitor, deleteMonitor, updateMonitor, displayMonitor, addMonitor} = require('../controllers/monitorController')
const { getUnreadFiles, deleteReadFiles } = require('../controllers/monitorNotifications')

router.route('/add')
  .get((req, res) => {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    addMonitor(req, res)

  });

router.route('/')
  .get(getAllMonitor)
  .post(updateMonitor)

router.route('/display')
  .get(displayMonitor)
  
router.route('/display/notifications')
  .get(getUnreadFiles)
  .delete(deleteReadFiles)


router.route('/delete/:id')
  .delete(deleteMonitor)

module.exports = router;
