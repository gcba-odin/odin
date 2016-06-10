"use strict";

/**
 * SearchController
 * @description :: Server-side logic for searching within records in database
 */

const _ = require('lodash');
const Promise = require('bluebird');

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const toLowerCase = _.partial(_.result, _, 'toLowerCase');
const parseModels = _.flow(toLowerCase, _.method('split', ','));

module.exports = (req, res) => {

    const q = req.param('query');
    const pageParam = req.param('page') || 1;
    const model = actionUtil.parseModel(req);

    if (!q) return res.badRequest(null, {
        message: 'You should specify a "query" parameter!'
    });


    const where = _.transform(model.definition, function(result, val, key) {
        if (val.type == 'string' && model.serchables.indexOf(key) != -1) {
            result.or.push(_.set({}, key, {
                contains: q
            }))
        }
    }, {
        or: []
    });
    model.find().where(where).paginate({
            page: pageParam
        })
        .then(records => [records, {
            meta: {
                code: 'OK',
                message: 'The operation was executed successfully.',
                count: _.size(records)
            }
            // links: builder.links(records)
        }]).spread(res.ok)
        .catch(res.negotiate);
};