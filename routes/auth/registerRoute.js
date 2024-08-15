const express = require('express')
const {registerNewUser} = require("../../controllers/auth/registerController")
const router = express.Router()


router.route("/")
    .post(registerNewUser)


module.exports = router