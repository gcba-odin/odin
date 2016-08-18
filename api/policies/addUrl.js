module.exports = function(req, res, next) {
    req.body.url = sails.config.odin.baseUrl + '/model/id';

    return next();
};