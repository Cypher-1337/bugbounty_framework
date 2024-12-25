const express = require('express');
const fuzz = require('../../controllers/fuzzing/fuzzingController.js'); // Import the controller

const router = express.Router();

router.route('/')
    .get(fuzz.fuzz); // Handle GET requests to /api/v1/fuzz (assuming your base path)

router.get('/report/:subdomain', fuzz.getReport); // Handle GET requests to /api/v1/fuzz/report/:subdomain

module.exports = router;