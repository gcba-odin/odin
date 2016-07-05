"use strict";

/**
 * 410 (Gone) Response
 *
 * The requested resource is soft deleted
 *
 */

module.exports = function(data, config) {
    const response = _.assign({
        code: _.get(config, 'code', 'E_GONE'),
        message: _.get(config, 'message', 'The requested resource is not available anymore.')
    }, _.get(config, 'root', {}));


    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(410);

    LogService.winstonLogResponse('Gone', response.code, response.message, this.res.headers, response, this.req.ip);

    this.res.send(response);
};