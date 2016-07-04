"use strict";

/**
 * 415 (Unsuported media type) Response
 *
 * A generic error message, given when no more specific message is suitable.
 * The general catch-all error when the server-side throws an exception.
 */

module.exports = function(data, config) {
    const response = _.assign({
        code: _.get(config, 'code', 'E_UNSUPPORTED_MEDIA_TYPE'),
        message: _.get(config, 'message', 'Filetype not allowed')
    }, _.get(config, 'root', {}));

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(415);

    LogService.winstonLogResponse('Unsupported Media Type', response.code, response.message, this.res.headers, response, this.req.ip)

    this.res.send(response);
};