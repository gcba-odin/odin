"use strict";

module.exports = function(data, meta) {
    const response = _.assign({
        meta: {
            code: 'OK',
            message: 'The operation was executed successfully.'
        },
        methods: data
    });

    this.res.status(200);
    this.res.jsonx(response);
};