"use strict";

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
    });
    //
    //     code: _.get(config, 'code', 'CREATED'),
    //     message: _.get(config, 'message', 'The request has been fulfilled and resulted in a new resource being created'),
    //     data: data || {}
    // }, _.get(config, 'root', {}));

    this.res.set({
        'Content-Type': 'application/json',
    });
    this.res.status(201);
    this.res.send(response);
};
