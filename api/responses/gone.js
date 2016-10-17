"use strict";

const _ = require('lodash');

/**
 * 410 (Gone) Response
 *
 * The requested resource is soft deleted
 *
 */

module.exports = function (links) {
    const response = _.assign({
        meta: {
            code: 'E_GONE',
            message: 'The requested resource is not available anymore.'
        },
        links: links
    });

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(410);

    LogService.winstonLogResponse('Gone', response.code, response.message, this.res.headers, response, this.req.ip);

    this.res.send(response);
};
