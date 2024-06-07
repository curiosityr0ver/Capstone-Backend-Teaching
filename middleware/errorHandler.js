
const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(501).json({
        error: err
    });
};

module.exports = errorHandler;