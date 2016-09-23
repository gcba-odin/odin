"use strict";

/**
 * SearchController
 * @description :: Server-side logic for searching within records in database
 */

const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var find = require('../blueprints/find.js');

module.exports = (req, res) => {
    
    const q = req.param('query');
    if (!q) return res.badRequest(null, {
        message: 'You should specify a "query" parameter!'
    });
    
    var model = actionUtil.parseModel(req);
    _.forEach(model.definition, function (val, key) {
        if (val.type === 'string' && model.searchables && model.searchables.indexOf(key) !== -1) {
            req.params[key] = q;
        }
    });

    return find(req,res);
};