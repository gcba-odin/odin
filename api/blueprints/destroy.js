"use strict";

const Response = require('../services/ResponseBuilderService');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Destroy One Record
 * DELETE /:model/:id
 *
 * Destroys the single model instance with the specified `id` from the data adapter for the given model if it exists.
 */
module.exports = (req, res) => {
    var builder = new Response.ResponseDELETE(req, res);

    builder.destroy
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


            LogService.winstonLog('info', model + ' deleted', {
                ip: req.ip,
                resource: record[0].id
            })
            res.deleted(record[0], {
                meta: builder.meta(),
                links: builder.links()
            })
        })
        .catch(res.negotiate);
};