const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const userRoute = require('./routes/userRoute');
const jobRoute = require('./routes/jobRoute');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

app.use('/user', userRoute);
app.use('/job', jobRoute);

app.get('/health', (req, res) => {
    // res.send
    res.json({
        message: 'Job listing API is working fine',
        status: 'Working',
        date: new Date().toLocaleDateString()
    });
});

app.use("*", (req, res) => {
    res.status(404).json({
        message: 'Endpoint not found',
        status: 'Error',
    });
});
//localhost:3000/health

app.use(errorHandler);

app.listen(PORT, () => {
    console.clear();
    console.log(`Server is running on port ${PORT}`);
});
