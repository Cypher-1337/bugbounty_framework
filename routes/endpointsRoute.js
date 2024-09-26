const express = require('express')
const {getDomains, metadata, getInterestingWords} = require('../controllers/endpoints/endpointsController')
const router = express.Router()

router.route('/')
    .get(getDomains)

router.route('/metadata')
    .get(metadata)

router.route('/words')
    .get(getInterestingWords)

module.exports = router 