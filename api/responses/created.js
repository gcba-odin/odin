"use strict";

const _ = require('lodash');

/**
 * 201 (Created) Response
 *
 * The request has been fulfilled and resulted in a new resource being created.
 * Successful creation occurred (via either POST or PUT).
 * Set the Location header to contain a link to the newly-created resource (on POST).
 * Response body content may or may not be present.
 */

module.exports = function(data, config) {
    const response = _.assign({
        meta: _.get(config, 'meta', {}),
        links: _.get(config, 'links', {}),
        data: data || {}
    });

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(201);

    LogService.winstonLogResponse('Created', response.meta.code, response.meta.message,
        this.res.headers, response, this.req.ip);

    this.res.send(response);
};
