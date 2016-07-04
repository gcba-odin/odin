"use strict";

const Response = require('../services/ResponseBuilderService');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Update One Record
 * PUT /:model/:id
 *
 * An API call to update a model instance with the specified `id`, treating the other unbound parameters as attributes.
 */
module.exports = (req, res) => {
    var builder = new Response.ResponsePATCH(req, res);

    builder.update
        .then(record => {
            var model = (actionUtil.parseModel(req)).adapter.identity;

            if (_.isUndefined(record[0])) {

                LogService.winstonLog('error', model + ' not found', {
                    ip: req.ip
                });

                return res.notFound(null, {
                    meta: builder.meta(undefined),
                    links: builder.links(undefined)
                });
            }
            LogService.log(req, record[0].id);

            LogService.winstonLog('info', model + ' updated', {
                ip: req.ip,
                resource: record[0].id
            })
            res.updated(record[0], {
                meta: builder.meta(record[0]),
                links: builder.links(record[0])
            })
        })
        .catch(res.negotiate);
};