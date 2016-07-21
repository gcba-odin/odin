"use strict";

/**
 * 404 (Not Found) Response
 *
 * The requested resource could not be found but may be available again in the future.
 * Subsequent requests by the client are permissible.
 * Used when the requested resource is not found, whether it doesn't exist.
 */

module.exports = function(data, config) {
    var defaultNotFound = {
        code: 'E_NOT_FOUND',
        message: 'The requested resource could not be found.'
    };
    const response = _.assign({
        meta: _.get(config, 'meta', defaultNotFound),
        links: _.get(config, 'links', {
            entryPoint: sails.config.odin.baseUrl
        })
    }, _.get(config, 'root', {}));

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(404);

    LogService.winstonLogResponse('Not Found', response.meta.code, response.meta.message,
        this.res.headers, response, this.req.ip);

    this.res.json(response);
};
