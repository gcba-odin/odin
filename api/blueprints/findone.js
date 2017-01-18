"use strict";

// const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
//
// const takeAliases = _.partial(_.map, _, item => item.alias);
// const populateAliases = (model, alias) => model.populate(alias);
const Response = require('../services/ResponseBuilderService');
const _ = require('lodash');

/**
 * Find One Record
 * GET /:model/:id
 *
 * An API call to find and return a single model instance from the data adapter using the specified id.
 */
module.exports = (req, res) => {
    // Create Builder instance here, then execute findQuery off it (ie, builder.findQuery)
    // Then save the instance in the config object (the one with the 'root' key)
    // And move over to the response file to finish the response off
    var builder = new Response.ResponseGET(req, res, false);

    builder.findQuery()
        .then(records => {
            if (_.isUndefined(records[0])) return res.notFound(null, {
                meta: builder.meta(undefined),
                links: builder.links(undefined)
            });
            else {
                var returnRecord = records[0];
                if(_.isUndefined(req.user)){
                    builder.filterObject(returnRecord, 'owner');
                    builder.filterObject(returnRecord, 'createdBy');
                }
                builder.partialIncludes(records);
                builder.removeIncludes(records);
                builder.filterFields(records);

                return res.ok(
                    returnRecord, {
                        meta: builder.meta(returnRecord),
                        links: builder.links(returnRecord)
                    }
                );
            }
        })
        .catch(res.negotiate);
};
