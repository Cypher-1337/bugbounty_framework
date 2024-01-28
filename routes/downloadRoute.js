const express = require('express')
const {getFile} = require('../controllers/downloadController')
const router = express.Router()


router.route('/')
    .get(getFile)


module.exports = router