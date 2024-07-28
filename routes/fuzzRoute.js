const express = require('express');
const router = express.Router();
const {displayFuzzing} = require("../controllers/fuzzController")


router.route('/')
    .get(displayFuzzing)




module.exports = router;
