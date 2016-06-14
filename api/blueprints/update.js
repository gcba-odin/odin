"use strict";

const Response = require('../services/ResponseBuilderService');

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
            LogService.log(req, record[0].id);
            res.updated(record[0], {
                meta: builder.meta(),
                links: builder.links()
            })
        })
        // .spread(function () {
        // LogService.log(req);
        // res.updated()
        .catch(res.negotiate);
};
