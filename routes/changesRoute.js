const express = require('express')
const { getAllChanges } =  require("../controllers/AliveContoller");
const router = express.Router()

router.route('/')
    .get(getAllChanges)



module.exports = router;
