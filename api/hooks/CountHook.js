"use strict";

/**
 * Adds support for count blueprint and binds :model/count route for each RESTful model.
 */
const Response = require('../services/ResponseBuilderService');
const _ = require('lodash');
const pluralize = require('pluralize');

const defaultCountBlueprint = (req, res) => {
    var builder = new Response.ResponseCount(req, res);
    builder.countQuery.then(count => res.ok({
        count
    }, {
        meta: builder._meta,
        links: builder._links
    }));
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