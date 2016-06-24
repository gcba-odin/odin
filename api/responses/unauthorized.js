"use strict";

/**
 * 401 (Unauthorized) Response
 *
 * Similar to 403 Forbidden.
 * Specifically for use when authentication is possible but has failed or not yet been provided.
 * Error code response for missing or invalid authentication token.
 */

module.exports = function(data, config) {
    const response = _.assign({
        code: _.get(config, 'code', 'E_UNAUTHORIZED'),
        message: _.get(config, 'message', 'Missing or invalid authentication token'),
        data: data || {}
    }, _.get(config, 'root', {}));

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(401);
    this.res.send(response);
};