module.exports = function(req, res, next) {
    // Make sure request is for a single entity, not for a collection of entities
    if (!req.params.id) {
        return res.forbidden('error.noPermission');
    }

    return next();
};