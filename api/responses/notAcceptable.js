"use strict";

const _ = require('lodash');

/**
 * 415 (Unsuported media type) Response
 *
 * A generic error message, given when no more specific message is suitable.
 * The general catch-all error when the server-side throws an exception.
 */

module.exports = function (data, config) {
    const response = _.assign({
        code: _.get(config, 'code', 'E_NOT_ACCEPTABLE'),
        message: _.get(config, 'message', 'The requested resource is not available in the specified format.')
    }, _.get(config, 'root', {}));

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(415);

    LogService.winstonLogResponse('Not Acceptable', response.code,
        response.message, this.res.headers, response, this.req.ip);

    this.res.send(response);
};
