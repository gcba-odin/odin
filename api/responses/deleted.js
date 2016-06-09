"use strict";

/**
 * 206 (OK DELETED) Response
 *
 * The request has been fulfilled and resulted in a resource being deleted.
 */

module.exports = function(data, config) {
    //
    //     code: _.get(config, 'code', 'CREATED'),
    //     message: _.get(config, 'message', 'The request has been fulfilled and resulted in a resource being created'),
    //     data: data || {}
    // }, _.get(config, 'root', {}));

    this.res.status(206);
    this.res.end();
};