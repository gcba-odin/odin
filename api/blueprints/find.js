"use strict";

// const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
//
// const takeAlias = _.partial(_.map, _, item => item.alias);
// const populateAlias = (model, alias) => model.populate(alias);

const Response = require('../services/ResponseBuilderService');

/**
 * Find Records
 * GET /:model
 *
 * An API call to find and return model instances from the data adapter using the specified criteria.
 * If an id was specified, just the instance with that unique id will be returned.
 */
module.exports = (req, res) => {
    // _.set(req.options, 'criteria.blacklist', ['fields', 'populate', 'limit', 'skip', 'page', 'sort']);
    //
    // const fields = req.param('fields') ? req.param('fields').replace(/ /g, '').split(',') : [];
    // const populate = req.param('populate') ? req.param('populate').replace(/ /g, '').split(',') : [];
    // const Model = actionUtil.parseModel(req);
    // const where = actionUtil.parseCriteria(req);
    // const limit = actionUtil.parseLimit(req);
    // const skip = req.param('page') * limit || actionUtil.parseSkip(req);
    // const sort = actionUtil.parseSort(req);
    // const query = Model.find(null, fields.length > 0 ? {
    //   select: fields
    // } : null).where(where).limit(limit).skip(skip).sort(sort);
    // const findQuery = _.reduce(_.intersection(populate, takeAlias(Model.associations)), populateAlias, query);


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
                var returnRecords = records;
                if(_.isUndefined(req.user)){
                    builder.filterObject(returnRecords, 'owner');
                    builder.filterObject(returnRecords, 'createdBy');
                }
                
                var filteredRecords = builder.filterAssociations(returnRecords);
                var paginatedRecords = builder.paginate(filteredRecords);
                builder.count(paginatedRecords);
                
                return res.ok(
                    paginatedRecords, {
                        meta: builder.meta(paginatedRecords),
                        links: builder.links(paginatedRecords)
                    }
                );
            }
        })
        .catch(res.negotiate);
};