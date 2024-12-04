const express = require('express');
const router = express.Router();
const { getAllMonitor, deleteMonitor,  displayMonitor, addMonitor} = require('../controllers/monitorController')
const { getUnreadFiles, deleteReadFiles, deleteAllNoti } = require('../controllers/monitorNotifications')

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


router.route('/display')
  .get(displayMonitor)
  
router.route('/display/notifications')
  .get(getUnreadFiles)
  .delete(deleteReadFiles)

router.route('/display/notifications/delete')
  .delete(deleteAllNoti)

router.route('/delete/:id')
  .delete(deleteMonitor)

module.exports = router;
