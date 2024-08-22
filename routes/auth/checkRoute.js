// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { validateToken } = require('../../controllers/auth/JWT');

// Route to check authentication status
router.get('/', validateToken, (req, res) => {
    // If the request reaches here, the token is valid
    res.status(200).json({ authenticated: req.authenticated , role: req.user.role });
});

module.exports = router;
