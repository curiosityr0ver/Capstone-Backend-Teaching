const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../model/User');

router.get('/', (req, res) => {
    res.json({
        message: 'User route is working fine',
        status: 'Working',
    });
});

// We'll create a validation middleware 
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        return res.status(400).json({
            message: 'User already exists, please use another email address',
        });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    }

    try {


        await newUser.save();
        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });

        // we need to handle cases where email already exists 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error',
            error,
        });
    }

});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            if (existingUser.password == password) {
                res.status(200).json({
                    message: 'Login successful',
                    email: existingUser.email
                });
            } else {
                res.status(400).json({
                    message: 'Invalid credentials',
                });
            }
        } else {
            res.status(400).json({
                message: 'User not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error,
        });
    }
});

module.exports = router;