const express = require('express')
const {getDomains} = require('../controllers/endpoints/endpointsController')
const router = express.Router()

router.route('/')
    .get(getDomains)


module.exports = router