const express = require('express')
const {getAllAlive, getAlive, updateAlive, deleteAlive} = require('../controllers/AliveContoller.js')
const router = express.Router()

router.route('/')
    .get(getAllAlive)
    .post(updateAlive)

router.route('/:id')
    .get(getAlive)
    .delete(deleteAlive)

module.exports = router