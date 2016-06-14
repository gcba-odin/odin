"use strict";

const Response = require('../services/ResponseBuilderService');

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
            LogService.log(req, record[0].id)
            res.deleted(record[0], {
                meta: builder.meta(),
                links: builder.links()
            })
        })
        .catch(res.negotiate);
};
