"use strict";

/**
 * 400 (Bad Request) Response
 *
 * The request cannot be fulfilled due to bad syntax.
 * General error when fulfilling the request would cause an invalid state.
 * Domain validation errors, missing data, etc.
 */

module.exports = function (links, message) {
    const response = _.assign({
        meta: {
            code: 'E_BAD_REQUEST',
            message: _.isUndefined(message) ?
                'The request cannot be fulfilled due to bad syntax' :
                message
        },
        links: links
    });

    this.res.set({
        'Content-Type': 'application/json',
        'Accept-Charset': 'utf-8'
    });
    this.res.status(400);

    LogService.winstonLogResponse('Bad Request', response.code, response.message,
        this.res.headers, response, this.req.ip);

    this.res.send(response);
};
