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
        .then( record => {
            LogService.log(req, record.id);
            res.created( record, {
                meta: builder.meta( record ),
                links: builder.links( record )
            });
        })
        .catch(res.negotiate);
};
