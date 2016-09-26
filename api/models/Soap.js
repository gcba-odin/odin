"use strict";

/**
 * Soap
 * @description :: Soap service implementation
 */

var webServicesModel  = require('./shared/WebServicesModel');

module.exports = _.merge({}, webServicesModel, {
	attributes: {
        /*
         * Defines the operation name to be invoked
         */
        method: {
            type: 'string',
            required: true,
            size: 500,
            minLength: 1
        },
        /*
         * Defines namespace for the operation
         */
        namespace: {
            type: 'string',
            required: true,
            size: 500,
            minLength: 1
        },
    }
});
