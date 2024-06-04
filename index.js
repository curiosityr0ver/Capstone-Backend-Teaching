const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const PORT = 3000;

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});



app.get('/health', (req, res) => {
    // res.send
    res.json({
        message: 'Job listing API is working fine',
        status: 'Working',
        date: new Date().toLocaleDateString()
    });
});
//localhost:3000/health


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
