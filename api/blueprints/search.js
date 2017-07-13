"use strict";

/**
 * SearchController
 * @description :: Server-side logic for searching within records in database
 */

const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const find = require('../blueprints/find.js');
const slug = require('slug');

module.exports = (req, res) => {

    let q = req.param('query');
    if (!q)
        return res.badRequest(null, {message: 'You should specify a "query" parameter!'});

    // console.log('q = ', decodeURI(q))
    q = decodeURI(q)
    // q = unescape(q)
    // console.log('slugged q = ', slug(decodeURI(q), {lower: true}).toString())
    var model = actionUtil.parseModel(req);
    _.forEach(model.definition, function(val, key) {
        if (val.type === 'string' && model.searchables && model.searchables.indexOf(key) !== -1) {
            if (key === 'slug')
                req.params[key] = slug(q, {lower: true})
            else
                req.params[key] = q;
            }
        });

    return find(req, res);
};
