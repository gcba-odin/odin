module.exports = function(req, res, next) {

    req.body.createdBy = (req.user ? req.user.id : 'dogPzIz9');

    return next();
};
