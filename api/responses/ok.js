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
  // Save Builder instance in config (in blueprint), retrieve it here with _.get()
  // Then fill in the Builder's fields (meta.code, meta.message, data, etc)
  // Ideally the Builder should let you put in headers and sed the response too
  // But for now it is just acting as a response body factory, rather than a response factory
  
  const response = _.assign({
    code: _.get(config, 'code', 'OK'),
    message: _.get(config, 'message', 'Operation is successfully executed'),
    data: data || {}
  }, _.get(config, 'root', {}));
  
  // Add headers to the res object as needed
  
  this.res.status(200);
  this.res.jsonx(response);
};
