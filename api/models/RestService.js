"use strict";

/**
 * RestService
 * @description :: Rest service implementation
 */

var webServicesModel  = require('./shared/WebServicesModel');

module.exports = _.merge({}, webServicesModel, {
	attributes: {
        /*
         * Defines table titles route(xpath o json-path)
         */
        datapath: {
            type: 'string',
            size: 500
        },
        /*
         * Defines table data route(xpath o json-path)
         */
        titlePath: {
            type: 'string',
            size: 500
        },
        /*
         * Defines request signing token
         */
        token: {
            type: 'string',
            size: 500
        },
        /*
         * Defines signing argument name
         */
        tokenSignature: {
            type: 'string',
            size: 500
        },
        /*
         * Defines signing argument encryption algorithm
         */
        tokenAlgorithm: {
            type: 'string',
            size: 500
        },
        username: {
            type: 'string',
            size: 500
        },
        password: {
            type: 'string',
            size: 500
        }
  }
});
