const express = require('express')
const {getdata} = require('../controllers/dorking/dorkingController')
const router = express.Router()

router.route('/')
    .get(getdata)


module.exports = router 