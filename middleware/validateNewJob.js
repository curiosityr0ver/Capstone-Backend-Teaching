const validateNewJob = (req, res, next) => {
    // company name, logo URL, job position/title
    //monthly salary, job type, remote, location, job description
    //about company, skills required, additional information
    const { companyName, title, description, logoUrl, salary, location, duration, locationType, information, jobType, skills } = req.body;
    const refUserId = req.refUserId;
    if (!companyName || !title || !description || !logoUrl || !salary || !location || !duration || !locationType || !information || !jobType || !skills || !refUserId) {
        return res.status(400).json({
            message: 'Please provide all required fields',
        });
    }
    const validJobTypes = ["Full-Time", "Part-Time", "Internship"];
    const validSkills = Array.isArray(skills) && skills.every(skill => typeof skill === 'string');
    const validSalary = typeof salary === 'number' && salary > 0;
    const validJobType = validJobTypes.includes(jobType);
    const validLogoUrl = logoUrl.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i);

    if (!validJobType) {
        return res.status(400).json({
            message: 'Invalid job type',
        });
    }
    if (!validSkills) {
        return res.status(400).json({
            message: 'Invalid skills',
        });
    }
    if (!validSalary) {
        return res.status(400).json({
            message: 'Invalid salary',
        });
    }
    if (!validLogoUrl) {
        return res.status(400).json({
            message: 'Invalid logo URL',
        });
    }
    next();
};

module.exports = validateNewJob;