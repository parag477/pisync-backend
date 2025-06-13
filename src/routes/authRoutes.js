const express = require('express');
const router = express.Router();
const { login, getCurrentUser, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/user
// @desc    Get current user
// @access  Private
router.get('/user', auth, getCurrentUser);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, logout);

module.exports = router;
