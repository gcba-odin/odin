module.exports = function(req, res, next) {
    // Make sure that the user specified is the current user
    if (req.query) {
        req.query.user = req.user.id;
    }

    return next();
};