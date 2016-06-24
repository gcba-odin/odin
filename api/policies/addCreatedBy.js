module.exports = function(req, res, next) {

    req.body.createdBy = (req.user ? req.user.id : 'noUser');

    return next();
}