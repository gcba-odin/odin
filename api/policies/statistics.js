const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = (req, res, next) => {
    //TBD: Client with KONG!

    data = {
        ip: req.ip,
        method: req.method,
        useragent: req.headers['user-agent'],
        resource: _.capitalize(actionUtil.parseModel(req).identity),
        querystring: (_.isEmpty(req.query)) ? null : JSON.stringify(req.query),
        endpoint: req.path
    };
    Statistic.create(data).exec(function created(err, newInstance) {
        if (err) return res.negotiate(err);
    });

    next();
}