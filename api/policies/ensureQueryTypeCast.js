    // api/policies/ensureQueryTypeCast.js
    var Cast = require('sails/node_modules/waterline/lib/waterline/core/typecast.js')

    module.exports = function(req, res, next) {

        var Model = sails.models[req.options.model],
            typeCast = new Cast();
        if (!_.isUndefined(Model)) {
            typeCast.initialize(Model._attributes);
            req.query = typeCast.run(req.query);
        }
        next();
    }