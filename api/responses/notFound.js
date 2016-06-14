"use strict";

/**
 * 404 (Not Found) Response
 *
 * The requested resource could not be found but may be available again in the future.
 * Subsequent requests by the client are permissible.
 * Used when the requested resource is not found, whether it doesn't exist.
 */

module.exports = function(data, config) {
    console.log(config);

    const response = _.assign({
        meta: _.get(config, 'meta', {}),
        links: _.get(config, 'links', {}),
    }, _.get(config, 'root', {}));


    this.res.set({
        'Content-Type': 'application/json',
    });
    this.res.status(404);
    this.res.json(response);
};
