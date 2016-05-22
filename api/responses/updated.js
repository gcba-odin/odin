"use strict";

/**
 * 200 (OK) Response
 *
 * General status code. Most common code used to indicate success.
 * The actual response will depend on the request method used.
 * In a GET request, the response will contain an entity corresponding to the requested resource.
 * In a POST request the response will contain an entity describing or containing the result of the action.
 */

module.exports = function (data, config) {
  const response = _.assign({
    statusCode: '200',
    statusMessage:'OK',
    code: _.get(config, 'code', 'UPDATED'),
    message: _.get(config, 'message', 'The request has been fulfilled and resulted in a modified resource'),
  }, _.get(config, 'root', {}));

  this.res.status(200);
  this.res.jsonx(response);
};
