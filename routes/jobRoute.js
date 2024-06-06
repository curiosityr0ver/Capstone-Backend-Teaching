const express = require('express');
const router = express.Router();
const Job = require('../model/Job');

router.get('/', async (req, res) => {

    const jobs = await Job.find();

    res.status(200).json({
        message: 'Job route is working fine',
        status: 'Working',
        jobs: jobs
    });
});

//queries
router.get('/:id', async (req, res) => {
    const jobID = req.params.id;

    try {
        const job = await Job.findById(jobID);
        if (job) {
            res.status(200).json({
                message: 'Job found',
                job: job
            });
        }
    } catch (error) {
        res.status(404).json({
            message: 'Job not found',
        });
    }

});


// company name, logo URL, job position/title
//monthly salary, job type, remote, location, job description
//about company, skills required, additional information
//author
router.post('/add', async (req, res) => {
    const { companyName, logoUrl, jobPosition, monthlySalary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired, additionalInformation, author } = req.body;

    const newJob = new Job({
        companyName,
        logoUrl,
        jobPosition,
        monthlySalary,
        jobType,
        remote,
        location,
        jobDescription,
        aboutCompany,
        skillsRequired,
        additionalInformation,
        author
    });

    await newJob.save();
    res.status(201).json({
        message: 'Job added successfully',
        jobID: newJob._id
    });
});


module.exports = router;