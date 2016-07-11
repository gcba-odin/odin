"use strict";

/**
 * 415 (Unsuported media type) Response
 *
 * A generic error message, given when no more specific message is suitable.
 * The general catch-all error when the server-side throws an exception.
 */

module.exports = function(links) {
    const response = _.assign({
        code: _.get(config, 'code', 'E_NOT_IMPLEMENTED'),
        message: _.get(config, 'message', 'The attempted operation is not supported.'),
        links: links
    }, _.get(config, 'root', {}));

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(501);

    this.res.send(response);
};