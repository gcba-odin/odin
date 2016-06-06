"use strict";

/**
 * SearchController
 * @description :: Server-side logic for searching within records in database
 */

const _ = require('lodash');
const Promise = require('bluebird');

const toLowerCase = _.partial(_.result, _, 'toLowerCase');
const parseModels = _.flow(toLowerCase, _.method('split', ','));

module.exports = {
    index(req, res) {
        const q = req.param('query');

        const pageParam = req.param('page') || 1;

        if (!q) return res.badRequest(null, {message: 'You should specify a "query" parameter!'});
        const models = parseModels(req.param('models')) || _.keys(sails.models);

        Promise.reduce(models, (res, modelName) => {
            const model = sails.models[modelName];

            const where = _.transform(model.definition, function (result, val, key) {
                if (val.type == 'string') {
                    result.or.push(_.set({}, key, {contains: q}))
                }
            }, {or: []});
            return Promise.join(modelName, model.find(where), _.partial(_.set, res));
        }, {}).then(records => {
            records = _.omitBy(records, _.isEmpty);
            return [records, {
                // records is an array of models, within each one, the result of the search
                // meta: {count: _.size(records)}
            }]
        }).spread(res.ok)
            .catch(res.negotiate);
    }
};
