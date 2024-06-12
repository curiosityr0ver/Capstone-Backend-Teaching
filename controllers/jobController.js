const Job = require('../model/Job');

function getJobById() {
    return async (req, res) => {
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
    };
}

function createNewJob() {
    return async (req, res, next) => {
        try {
            const { companyName, title, description, logoUrl, jobPosition, salary, location, duration, locationType, information, jobType, skills } = req.body;
            const refUserId = req.refUserId;
            const newJob = new Job({
                companyName,
                title,
                description,
                logoUrl,
                jobPosition,
                salary,
                location,
                duration,
                locationType,
                information,
                jobType,
                skills,
                refUserId
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
    };
}

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

function updateExistingJob() {
    return async (req, res) => {
        try {
            const jobID = req.params.id;
            const { companyName, title, description, logoUrl, jobPosition, salary, location, duration, locationType, information, jobType, skills } = req.body;
            const refUserId = req.refUserId;
            const updatedJob = await Job.findByIdAndUpdate(jobID, {
                companyName,
                title,
                description,
                logoUrl,
                jobPosition,
                salary,
                location,
                duration,
                locationType,
                information,
                jobType,
                skills,
                refUserId
            });

            res.status(200).json({
                message: 'Job updated successfully',
                job: updatedJob
            });
        } catch (error) {
            next("Error Updating Job", error);
        }
    };
}

function deleteJob() {
    return async (req, res) => {
        try {
            const jobID = req.params.id;
            await Job.findByIdAndDelete(jobID);
            res.status(200).json({
                message: 'Job deleted successfully',
            });
        } catch (error) {
            next("Error Deleting Job", error);
        }
    };
}


module.exports = {
    getJobById,
    createNewJob,
    getFilteredJobs,
    updateExistingJob,
    deleteJob
};
