const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/User');
const validateNewUser = require('../middleware/validateNewUser');

router.get('/', (req, res) => {
    res.json({
        message: 'User route is working fine',
        status: 'Working',
    });
});

// We'll create a validation middleware (data is missing)
router.post('/register', validateNewUser, async (req, res) => {
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
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            if (isPasswordCorrect) {
                const token = jwt.sign(
                    { email: existingUser.email }, //PAYLOAD (object you to convert to a string/token)
                    'secret', // Secret Key, key that is being used to encrypt and validation signature
                    { expiresIn: '1h' } //Optional argument, to make the token temporary 
                );
                res.status(200).json({
                    message: 'Login successful',
                    email: existingUser.email,
                    token
                });

                // a jsonwebtoken is a string that tells the server that the user is authenticated
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