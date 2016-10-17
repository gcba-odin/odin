"use strict";

// const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
//
// const takeAlias = _.partial(_.map, _, item => item.alias);
// const populateAlias = (model, alias) => model.populate(alias);

const Response = require('../services/ResponseBuilderService');
const _ = require('lodash');

/**
 * Find Records
 * GET /:model
 *
 * An API call to find and return model instances from the data adapter using the specified criteria.
 * If an id was specified, just the instance with that unique id will be returned.
 */
module.exports = (req, res) => {
    // Create Builder instance here, then execute findQuery off it (ie, builder.findQuery)
    // Then save the instance in the config object (the one with the 'root' key)
    // And move over to the response file to finish the response off
    var builder = new Response.ResponseGET(req, res, true);

    builder.findQuery()
        .then(records => {
            if (_.isUndefined(records)) return res.notFound(null, {
                meta: builder.meta(undefined),
                links: builder.links(undefined)
            });
            else {
                if(_.isUndefined(req.user)){
                    builder.filterObject(records, 'owner');
                    builder.filterObject(records, 'createdBy');
                }

                if(!_.isUndefined(builder.params.where.deep) && !_.isEmpty(builder.params.where.deep)){
                    //Some models don't need to filter records because of empty associations
                    //In those cases, we're previously paginating on server
                    if(builder._model.removeEmptyAssociations) {
                        records = builder.filterAssociations(records);
                        builder.count(records);
                        records = builder.paginate(records);
                    }
                }
                builder.removeIncludes(records);

                res.ok(
                    records, {
                        meta: builder.meta(records),
                        links: builder.links(records)
                    }
                );
                records = null;
            }
        })
        .catch(res.negotiate);
};
