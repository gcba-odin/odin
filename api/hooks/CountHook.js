"use strict";

/**
 * Adds support for count blueprint and binds :model/count route for each RESTful model.
 */
const Response = require('../services/ResponseBuilderService');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const _ = require('lodash');
const pluralize = require('pluralize');

const defaultCountBlueprint = (req, res) => {
    
    var model = actionUtil.parseModel(req);    
    const q = req.param('query');
    if(q){
        _.forEach(model.definition, function (val, key) {
            if (val.type === 'string' && model.searchables && model.searchables.indexOf(key) !== -1) {
                req.params[key] = q;
            }
        });
    }
    
    //Association filters. We need to retrieve the results and then filter out in client side
    var findBuilder = new Response.ResponseGET(req, res, true);
    var findQuery = findBuilder.findQuery();
    var countBuilder = new Response.ResponseCount(req, res, true);
    
    var sharedInfo = {
        meta: countBuilder._meta,
        links: countBuilder._links
    };

    if(!_.isUndefined(findBuilder.params.where) && !_.isUndefined(findBuilder.params.where.deep) && !_.isEmpty(findBuilder.params.where.deep)){
        findQuery.then(records => {
            if(findBuilder._model.removeEmptyAssociations) {
                records = findBuilder.filterAssociations(records);
            }
            findBuilder.count(records);
            
            res.ok(
                { count: findBuilder._count }, sharedInfo
            );
            records = null;
        })
        .catch(res.negotiate);
    }
    else{
        //Direct server count.
        countBuilder.countQuery.then(count => res.ok({
            count
        }, sharedInfo));
    }
};

module.exports = sails => {
    return {
        initialize: cb => {
            const config = sails.config.blueprints;
            const countFn = _.get(sails.middleware, 'blueprints.count') || defaultCountBlueprint;

            sails.on('router:before', () => {
                _.forEach(sails.models, model => {
                    const controller = sails.middleware.controllers[model.identity];

                    if (!controller) return;

                    let baseRoute = [config.prefix, model.identity].join('/');

                    if (config.pluralize && _.get(controller, '_config.pluralize', true)) {
                        baseRoute = pluralize(baseRoute);
                    }

                    const route = baseRoute + '/count';

                    sails.router.bind(route, countFn, null, {
                        controller: model.identity
                    });
                });

            });

            cb();
        }
    };
};