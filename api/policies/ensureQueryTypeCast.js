    // api/policies/ensureQueryTypeCast.js
    var Cast = require('sails/node_modules/waterline/lib/waterline/core/typecast.js')

    module.exports = function(req, res, next) {
        var Model = sails.models[req.options.model],
            typeCast = new Cast();

        typeCast.initialize(Model._attributes);
        console.dir(req.query)
        req.query = typeCast.run(req.query);
        console.dir(req.query)

        next();
    }