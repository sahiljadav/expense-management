const express = require('express');
const { registerAdmin, login, signup } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
