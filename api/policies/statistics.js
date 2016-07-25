const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var ipaddr = require('ipaddr.js');

module.exports = (req, res, next) => {
    //TBD: Client with KONG!
    var addr = ipaddr.parse(req.ip);
    console.log('is ipv4mapped addres ? ' + addr.isIPv4MappedAddress());
    console.log('addr to ipv4 -> to string =  ' + addr.toIPv4Address().toString());
    console.log('addr to string =  ' + addr.toString());

    data = {
        ip: addr.isIPv4MappedAddress() ? addr.toIPv4Address().toString() : addr.toString(),
        method: req.method,
        useragent: req.headers['user-agent'],
        resource: _.capitalize(actionUtil.parseModel(req).identity),
        querystring: (_.isEmpty(req.query)) ? null : JSON.stringify(req.query),
        endpoint: req.path
    };
    Statistic.create(data).exec(function created(err) {
        if (err) return res.negotiate(err);
    });

    next();
};