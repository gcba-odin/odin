"use strict";

/**
 * 206 (OK DELETED) Response
 *
 * The request has been fulfilled and resulted in a resource being deleted.
 */

module.exports = function(data, config) {

    LogService.winstonLog('verbose', 'Deleted', {
        ip: this.req.ip
    });

    this.res.status(204);

    LogService.winstonLogResponse('Deleted', '', '', this.res.headers, '', this.req.ip);

    this.res.end();
};