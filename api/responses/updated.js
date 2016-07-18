"use strict";

/**
 * 200 (OK) Response
 *
 * General status code. Most common code used to indicate success.
 * The actual response will depend on the request method used.
 * In a GET request, the response will contain an entity corresponding to the requested resource.
 * In a POST request the response will contain an entity describing or containing the result of the action.
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
    this.res.status(200);
    LogService.winstonLogResponse('Updated', response.meta.code, response.meta.message,
        this.res.headers, response, this.req.ip);

    this.res.send(response);
};