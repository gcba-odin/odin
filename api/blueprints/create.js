"use strict";

const Response = require('../services/ResponseBuilderService');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const _ = require('lodash');

/**
 * Create Record
 * POST /:model
 *
 * An API call to create and return a single model instance using the specified parameters.
 */

module.exports = (req, res) => {
    var builder = new Response.ResponsePOST(req, res);

    builder.create
        .then(record => {
            var model = (actionUtil.parseModel(req)).adapter.identity;

            LogService.log(req, record.id);

            LogService.winstonLog('info', model + ' created', {
                ip: req.ip,
                resource: record.id
            });
            var associations = [];

            _.forEach(builder._model.definition, function(value, key) {
                if (value.foreignKey) {
                    associations.push(key);
                }
            });
            //populate the response

            builder._model.find(record.id).populate(associations).exec(function(err, record) {
                if (err) res.negotiate(err);
                res.created(record[0], {
                    meta: builder.meta(record[0]),
                    links: builder.links(record[0])
                });

            });

        })
        .catch(res.negotiate);
};
