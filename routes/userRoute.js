const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/User');
const validateNewUser = require('../middleware/validateNewUser');
const { registerUser, handleLogin } = require('../controllers/userController');

router.get('/', (req, res) => {
    res.json({
        message: 'User route is working fine',
        status: 'Working',
    });
});

// We'll create a validation middleware (data is missing)
router.post('/register', validateNewUser, registerUser());


router.post('/login', handleLogin());

module.exports = router;
