// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verifyToken', verifyToken);

module.exports = router;