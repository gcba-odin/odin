"use strict";

/**
 * 404 (Not Found) Response
 *
 * The requested resource could not be found but may be available again in the future.
 * Subsequent requests by the client are permissible.
 * Used when the requested resource is not found, whether it doesn't exist.
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const pluralize = require('pluralize');

module.exports = function(data, config) {
    if (_.isUndefined(config) || _.isUndefined(config.links)) {
        config = {}
        try {
            // Find the name of all the models
            // Check if any of the models match a part of the url
            var exist = _.pickBy(_.keys(sails.models), function(val) {
                val = pluralize(val);
                return _.includes(this.req.path, val);
            }.bind(this));

            if (!_.isEmpty(exist)) {
                config.links = {
                    all: sails.config.odin.baseUrl + '/' + pluralize(_.values(exist)[0])
                };
            }
        } catch (err) {
            console.dir(err)

            config.links = {
                entryPoint: sails.config.odin.baseUrl
            };
        }

    }
    var defaultNotFound = {
        code: 'E_NOT_FOUND',
        message: 'The requested resource could not be found.'
    };
    const response = _.assign({
        meta: _.get(config, 'meta', defaultNotFound),
        links: _.get(config, 'links')
    }, _.get(config, 'root', {}));

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(404);

    LogService.winstonLogResponse('Not Found', response.meta.code, response.meta.message,
        this.res.headers, response, this.req.ip);

    this.res.json(response);
};