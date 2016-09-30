"use strict";

/**
 * 500 (Internal Server Error) Response
 *
 * A generic error message, given when no more specific message is suitable.
 * The general catch-all error when the server-side throws an exception.
 */

module.exports = function(data, config) {
    const response = _.assign({
        code: _.get(config, 'code', 'E_INTERNAL_SERVER_ERROR'),
        message: _.get(config, 'message', 'Something bad happened on the server'),
        data: data || {}
    }, _.get(config, 'root', {}));

    if (!this.res.headersSent) {
        LogService.winstonLog('verbose', 'Server Error', {
            ip: this.req.ip,
            code: response.code,
            message: response.message
        });

        this.res.set({
            'Content-Type': 'application/json'
        });
        this.res.status(500);

        LogService.winstonLogResponse('Server Error', response.code, response.message,
            this.res.headers, response, this.req.ip);

        this.res.send(response);
    }
};