"use strict";

const _ = require('lodash');

/**
 * 403 (Forbidden) Response
 *
 * The request was a legal request, but the server is refusing to respond to it.
 * Unlike a 401 Unauthorized response, authenticating will make no difference.
 * Error code for user not authorized to perform the operation or the resource is unavailable for some reason.
 */

module.exports = function(data, config) {
  const response = _.assign({
    code: _.get(config, 'code', 'E_FORBIDDEN'),
    message: _.get(config, 'message', 'User not authorized to perform the operation'),
    data: data || {}
  }, _.get(config, 'root', {}));

  LogService.winstonLog('verbose', 'Forbidden', {
    ip: this.req.ip,
    code: response.code,
    message: response.message
  });

  this.res.set({
    'Content-Type': 'application/json'
  });
  this.res.status(403);

  LogService.winstonLogResponse('Forbidden', response.code, response.message, this.res.headers, response, this.req.ip);

  this.res.send(response);
};
