const express = require('express');
const router = express.Router();
const validateNewJob = require('../middleware/validateNewJob');
const { getFilteredJobs, getJobById, createNewJob, updateExistingJob, deleteJob } = require('../controllers/jobController');
const verifyToken = require('../middleware/verifyToken');


router.get('/', getFilteredJobs());

router.get('/:id', getJobById());

router.post('/add', verifyToken, validateNewJob, createNewJob());

router.put('/update/:id', verifyToken, validateNewJob, updateExistingJob());

router.delete('/delete/:id', verifyToken, deleteJob());



module.exports = router;

