"use strict";

/**
 * NotImplementedController
 * @description :: Server-side logic for ...
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const pluralize = require('pluralize');

module.exports = {
    notImplemented(req, res) {
        var model = actionUtil.parseModel(req);
        var modelName = pluralize(model.identity);
        var links = {
            all: req.host + ':' + req.port + '/' + modelName
        };
        return res.notImplemented(links);
    }
};
