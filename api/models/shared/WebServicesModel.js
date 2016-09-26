"use strict";

/**
 * WebServicesModel
 * @description :: Parent model for all web services
 */

var shortId = require('shortid');

module.exports = {
    schema: true,

    attributes: {
        id: {
            type: 'string',
            unique: true,
            index: true,
            defaultsTo: shortId.generate,
            primaryKey: true,
            size: 15
        },
        url: {
            type: 'string',
            required: true,
            size: 500,
            minLength: 1
        },
        /*attributesAsHeaders: {
            type: 'boolean',
            defaultsTo: false
        },
        
        attributesAsHeaders: {
            type: 'string',
            size: 350
        },*/
        parameters: {
            type: 'json'
        },

        toJSON() {
            return this.toObject();
        }
    }
};
