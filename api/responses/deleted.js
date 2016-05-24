"use strict";

/**
 * 200 (OK DELETED) Response
 *
 * The request has been fulfilled and resulted in a new resource being deleted.
 */

module.exports = function (data, config) {
    const response = _.assign({
        meta: _.get(config, 'meta', {}),
        links: _.get(config, 'links', {}),
    });
    //
    //     code: _.get(config, 'code', 'CREATED'),
    //     message: _.get(config, 'message', 'The request has been fulfilled and resulted in a new resource being created'),
    //     data: data || {}
    // }, _.get(config, 'root', {}));
    this.res.status(200);
    this.res.jsonx(response);
};
