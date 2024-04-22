const express = require('express')
const {getAllAlive, getAlive, updateAlive, deleteAlive, updateScanned} = require('../controllers/AliveContoller.js')
const router = express.Router()

router.route('/')
    .get(getAllAlive)
    .post(updateAlive)

router.route('/:id')
    .get(getAlive)
    .delete(deleteAlive)
    .patch(updateScanned)

module.exports = router