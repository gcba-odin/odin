module.exports = function(req, res, next) {
    req.user ? req.body.createdBy = req.user.id : req.body.createdBy = 'noUser'
    return next();
}