const express = require('express')
const {getDomains, metadata, getInterestingWords} = require('../controllers/endpoints/endpointsController')
const {getFilters, insertFilter} = require('../controllers/endpoints/filterEndpoints')
const router = express.Router()

router.route('/')
    .get(getDomains)

router.route('/metadata')
    .get(metadata)

router.route('/words')
    .get(getInterestingWords)

router.route('/filter')
    .get(getFilters)
    .post(insertFilter)

module.exports = router 