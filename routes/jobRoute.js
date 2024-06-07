const express = require('express');
const router = express.Router();
const Job = require('../model/Job');
const validateNewJob = require('../middleware/validateNewJob');


router.get('/', getFilteredJobs());

//queries
router.get('/:id', async (req, res) => {
    try {
        const jobID = req.params.id;
        const job = await Job.findById(jobID);
        if (job) {
            res.status(200).json({
                message: 'Job found',
                job: job
            });
        }
    } catch (error) {
        next("Error Finding Job", error);
    }
});


// company name, logo URL, job position/title
//monthly salary, job type, remote, location, job description
//about company, skills required, additional information
//author
router.post('/add', validateNewJob, async (req, res, next) => {
    try {
        const { companyName, logoUrl, jobPosition, monthlySalary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired, additionalInformation, author } = req.body;
        const arr = [1, 2, 3];
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
    } catch (error) {
        next({
            message: "Error Adding Job",
            error
        });
    }
});


module.exports = router;

function getFilteredJobs() {
    return async (req, res) => {

        try {
            const { minSalary, maxSalary, jobType, location, remote, skills } = req.query;
            const skillsArray = skills ? skills.split(',') : [];
            const jobs = await Job.find(
                {
                    monthlySalary: {
                        $gte: minSalary || 0,
                        $lte: maxSalary || 999999999
                    },
                    jobType: jobType || { $exists: true },
                    location: location || { $exists: true },
                    remote: remote == 'true' || { $exists: true },
                }
            );

            const finalJobs = jobs.filter(job => {
                let isSkillMatched = true;
                if (skillsArray.length > 0) {
                    isSkillMatched = skillsArray.every(skill => job.skillsRequired.includes(skill));
                }
                return isSkillMatched;
            });

            //Handle this in the mongoose query itself
            res.status(200).json({
                message: 'Job route is working fine',
                status: 'Working',
                jobs: finalJobs
            });
        } catch (error) {
            next("Error Finding Jobs", error);
        }
    };
}
