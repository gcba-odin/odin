"use strict";

const Response = require('../services/ResponseBuilderService');

/**
 * Create Record
 * POST /:model
 *
 * An API call to create and return a single model instance using the specified parameters.
 */
module.exports = (req, res) => {
    var builder = new Response.ResponsePOST(req, res);

    builder.create
        .then(records => [records, {
            meta: builder.meta,
            links: builder.links
        }])
        .spread(res.created)
        .catch(res.negotiate);
};
