const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const authenticateJWT = require('../middleware/auth');

// Register a new user
router.post('/register', registerUser);

// Login an existing user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', authenticateJWT, getUserProfile);

module.exports = router;