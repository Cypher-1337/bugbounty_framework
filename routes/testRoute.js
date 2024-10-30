const express = require('express')
const router = express.Router()
const {testing} = require("../controllers/test/testController")



router.route('/')
    .get(testing)



module.exports = router