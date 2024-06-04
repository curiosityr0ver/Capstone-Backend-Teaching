const express = require('express');

const router = express.Router();
const User = require('../model/User');

router.get('/', (req, res) => {
    res.json({
        message: 'User route is working fine',
        status: 'Working',
    });
});