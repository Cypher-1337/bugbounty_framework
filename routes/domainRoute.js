const express = require('express')
const {getAllDomains, updateDomain, deleteDomain} = require('../controllers/domainsContoller')
const router = express.Router()

router.route('/')
    .get(getAllDomains)
    .post(updateDomain)

router.route('/:id')
    .delete(deleteDomain)
    
module.exports = router