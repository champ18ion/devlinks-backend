const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User signup route
router.post('/signup', authController.signup);

// User signin route
router.post('/signin', authController.signin);

module.exports = router;
