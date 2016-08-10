"use strict";

module.exports = function(data) {
    const response = _.assign({
        meta: {
            code: 'OK',
            message: 'The operation was executed successfully.'
        },
        methods: data
    });

    LogService.winstonLog('verbose', 'Options', {
        ip: this.req.ip,
        code: response.code,
        message: response.message
    });

    this.res.status(200);

    LogService.winstonLogResponse('Options response', response.meta.code, response.meta.message,
        this.res.headers, response, this.req.ip);

    this.res.jsonx(response);
};
