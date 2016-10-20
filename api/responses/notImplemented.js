"use strict";

const _ = require('lodash');

/**
 * 501 (Not Implemented) Response
 */

module.exports = function (links) {

    const response = _.assign({
        meta: {
            code: 'E_NOT_IMPLEMENTED',
            message: 'The attempted operation is not supported.'
        },
        links: links
    });

    this.res.set({
        'Content-Type': 'application/json'
    });
    this.res.status(501);

    this.res.send(response);
};
