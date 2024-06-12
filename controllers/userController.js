const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

function registerUser() {
    return async (req, res) => {
        try {
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
        } catch (error) {
            next("Error Creating User", error);
        }

    };
}

function handleLogin() {
    return async (req, res) => {
        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({ email: email });

            if (existingUser) {
                const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
                if (isPasswordCorrect) {
                    const token = jwt.sign(
                        { userID: existingUser._id }, //PAYLOAD (object you to convert to a string/token)
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
            next("Error Logging In", error);
        }
    };
}

module.exports = {
    registerUser,
    handleLogin
};
