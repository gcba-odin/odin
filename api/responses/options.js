"use strict";

module.exports = function(data, meta) {
    const response = _.assign({
        meta: meta,
        methods: data
    });

    this.res.status(200);
    this.res.jsonx(response);
};