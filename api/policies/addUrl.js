module.exports = function(req, res, next) {
    req.body.url = req.protocol + '://' + req.host + ':' + req.port + '/model/id';

    return next();
};