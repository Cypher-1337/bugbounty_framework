const express = require('express')
const {insertFilter} = require('../controllers/filter_subdomains/filter_subdomains')
const router = express.Router()

router.route('/')
    .post(insertFilter)


module.exports = router 