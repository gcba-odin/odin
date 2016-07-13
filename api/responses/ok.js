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
    // Save Builder instance in config (in blueprint), retrieve it here with _.get()
    // Then fill in the Builder's fields (meta.code, meta.message, data, etc)
    // Then run the Builder's build() method and save it to data. Put the data in the response
    // Ideally the Builder should let you put in headers and sed the response too
    // But for now it is just acting as a response body factory, rather than a response factory
    const response = _.assign({
        meta: _.get(config, 'meta', {}),
        data: data || {},
        links: _.get(config, 'links', {})
    }, _.get(config, 'root', {}));

    var status = "";

    try {
        status = sails.config.success[response.meta.code].status;
    } catch (err) {
        status = 200;
    }

    // Add headers to the res object as needed
    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(status);

    LogService.winstonLogResponse('Ok', response.meta.code, response.meta.message,
        this.res.headers, response, this.req.ip);

    this.res.send(response);
};
