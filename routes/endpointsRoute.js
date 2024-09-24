const express = require('express')
const {getDomains, metadata} = require('../controllers/endpoints/endpointsController')
const router = express.Router()

router.route('/')
    .get(getDomains)

router.route('/metadata')
    .get(metadata)

module.exports = router 