"use strict";

// const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
//
// const takeAliases = _.partial(_.map, _, item => item.alias);
// const populateAliases = (model, alias) => model.populate(alias);
const Response = require('../services/ResponseBuilderService');

/**
 * Find One Record
 * GET /:model/:id
 *
 * An API call to find and return a single model instance from the data adapter using the specified id.
 */
module.exports = (req, res) => {
    // _.set(req.options, 'criteria.blacklist', ['fields', 'populate', 'limit', 'skip', 'page', 'sort']);
    //
    // const fields = req.param('fields') ? req.param('fields').replace(/ /g, '').split(',') : [];
    // const populate = req.param('populate') ? req.param('populate').replace(/ /g, '').split(',') : [];
    // const Model = actionUtil.parseModel(req);
    // const pk = actionUtil.requirePk(req);
    // const query = Model.find(pk, fields.length > 0 ? {
    //     select: fields
    // } : null);
    // const findQuery = _.reduce(_.intersection(populate, takeAliases(Model.associations)), populateAliases, query);

    // Create Builder instance here, then execute findQuery off it (ie, builder.findQuery)
    // Then save the instance in the config object (the one with the 'root' key)
    // And move over to the response file to finish the response off
    var builder = new Response.ResponseGET(req, res, false);

    builder.findQuery
        .then(record => {
            if (_.isUndefined(record[0])) return res.notFound(null, {
                meta: builder.meta(undefined),
                links: builder.links(undefined)
            });
            else {
                return res.ok(
                    record[0], {
                        meta: builder.meta(),
                        links: builder.links(record[0])
                    }
                );
            }
        })
        .catch(res.negotiate);
};