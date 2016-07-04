"use strict";

const Response = require('../services/ResponseBuilderService');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

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
            console.log(' before winston')
            LogService.winstonLog('info', model + ' created', {
                ip: req.ip,
                resource: record.id
            });
            console.log(' after winston')

            res.created(record, {
                meta: builder.meta(record),
                links: builder.links(record)
            });
        })
        .catch(res.negotiate);
};