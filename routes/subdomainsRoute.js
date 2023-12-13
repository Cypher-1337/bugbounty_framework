const express = require('express')
const {getAllSubdomains} = require('../controllers/SubdomainsContoller.js')
const router = express.Router()

router.route('/')
    .get(getAllSubdomains)


module.exports = router 