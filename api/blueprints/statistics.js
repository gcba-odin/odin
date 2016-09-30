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
    var modelLowercase = (actionUtil.parseModel(req)).adapter.identity;
    var modelPlural = pluralize(modelLowercase);

    var model = _.upperFirst(modelLowercase);

    var groupBy = req.param('groupBy');
    var action = req.param('action');

    if (groupBy !== undefined) {
        Statistic.find({
            resource: model
        }).exec(function(err, data) {
            if (err) return res.negotiate(err);

            var groupedDataById = _.groupBy(data, function(value) {
                var splittedEndpoint = _.split(value.endpoint, '/'); 
                var itemId = splittedEndpoint[2];
                //TODO: Add action filter logic when groupBy === undefined
                if(action !== undefined){
                    if(splittedEndpoint[3] != action) return null;
                }
                return shortid.isValid(itemId) ? itemId : null
            });
            delete groupedDataById['null']

            groupedDataById = _.transform(groupedDataById, function(result, val, key) {
                var groupedMethods = _.groupBy(val, function(value) {
                    return value.method;
                });
                groupedMethods = _.transform(groupedMethods, function(result, val, key) {
                    result[key] = _.size(val);
                }, {});

                var value = {
                    count: groupedMethods
                }
                result[key] = value;
            }, {});

            // grouped data by id = { id: count { method : hits }, resource: model }

            sails.models[groupBy].find().populate(modelPlural).exec(function(err, records) {
                if (err) return res.negotiate(err);
                var groupedByModel = _.transform(records, function(result, val) {
                    // find the associated record. eg.: categories[datasets]
                    _.forEach(val[modelPlural], function(associatedModel) {
                        if (!_.isUndefined(groupedDataById[associatedModel.id])) {

                            if (_.isUndefined(result[val.id])) {
                                result[val.id] = groupedDataById[associatedModel.id];
                            } else {
                                result[val.id].count.GET += groupedDataById[associatedModel.id].count.GET;
                                // result[val.id] = this.add(result[val.id], groupedDataById[associatedModel.id])
                            }
                        }
                    });

                }, {})
                var links = {
                    all: sails.config.odin.baseUrl + '/' + modelPlural
                };

                var meta = {
                    code: sails.config.success.OK.code,
                    message: sails.config.success.OK.message
                };
                return res.ok(groupedByModel, {
                    links: links,
                    meta: meta
                })

            });
        });
    } else {
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
            if (err) return res.negotiate(err);
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
    }
};