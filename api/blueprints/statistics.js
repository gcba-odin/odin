"use strict";

/**
 * SearchController
 * @description :: Server-side logic for searching within records in database
 */

const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const pluralize = require('pluralize');
const shortid = require('shortid');


module.exports = (req, res) => {


    var response = {};
    var model = (actionUtil.parseModel(req)).adapter.identity;

    var modelPlural = pluralize(model);

    model = _.upperFirst(model);

    var filters = {
        all: '/' + modelPlural,
        first: '/' + modelPlural + '/first',
        last: '/' + modelPlural + '/last',
        count: '/' + modelPlural + '/count'
    };

    var filtersValues = _.values(filters)

    Statistic.find({
        resource: model
    }).exec(function(err, data) {
        var groupedData = _.groupBy(data, function(value) {
            return value.endpoint;
        });
        var countedData = _.transform(groupedData, function(result, val, key) {

            // Group methods {GET: 20, OPTIONS: 5}
            var groupedMethods = _.groupBy(val, function(value) {
                return value.method;
            });
            groupedMethods = _.transform(groupedMethods, function(result, val, key) {
                result[key] = _.size(val);
            }, {});
            // if the key if one of the generals (filters)
            if (filtersValues.indexOf(key) === -1) {
                var itemId = _.split(key, '/')[2];
                // else, we return an object
                var value = {
                    count: groupedMethods,
                    item: shortid.isValid(itemId) ? itemId : '',
                    resource: _.first(val).resource
                }
                result[key] = value;
            } else {
                result[key] = _.size(val);
            }
        }, {});


        response[filters.all] = countedData[filters.all] || 0;
        response[filters.first] = countedData[filters.first] || 0;
        response[filters.last] = countedData[filters.last] || 0;
        response[filters.count] = countedData[filters.count] || 0;

        delete countedData[filters.all];
        delete countedData[filters.first];
        delete countedData[filters.last];
        delete countedData[filters.count];

        response['items'] = countedData;

        var links = {
            all: sails.config.odin.baseUrl + '/' + modelPlural
        };

        var meta = {
            code: sails.config.success.OK.code,
            message: sails.config.success.OK.message
        };
        return res.ok(response, {
            links: links,
            meta: meta
        })
    });
};