"use strict";

/**
 * NotImplementedController
 * @description :: Server-side logic for ...
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    notImplemented(req, res) {
        var model = actionUtil.parseModel(req);
        var modelName = pluralize(model.identity);
        links = {
            all: req.host + ':' + req.port + '/' + modelName
        };
        return res.notImplemented();
    }
};