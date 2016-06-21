"use strict";

/**
 * SearchController
 * @description :: Server-side logic for searching within records in database
 */

const _ = require('lodash');
const Response = require('../services/ResponseBuilderService');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const toLowerCase = _.partial(_.result, _, 'toLowerCase');

module.exports = (req, res) => {
    var builder = new Response.ResponseSearch( req, res, true );

    builder.searchQuery()
        .then(records => {
            if (_.isUndefined(records)) return res.notFound(null, {
                meta: builder.meta(undefined),
                links: builder.links(undefined)
            });
            else {
                //if (!_.isEmpty(builder.includes)) {
                //    records[0] = _.assign(records[0], builder.includes);
                //}
                return res.ok(
                    records, {
                        meta: builder.meta(records),
                        links: builder.links(records)
                    }
                );
            }
        })
        .catch(res.negotiate);
};
