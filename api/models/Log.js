"use strict";

/**
 * Log
 * @description :: Model for storing Log records
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
        action: {
            type: 'string',
            required: true,
            enum: ['create', 'update', 'delete']
        },
        target: {
            type: 'string',
            required: true
        },
        resource: {
            type: 'string',
            required: true,
            size: 15
        },
        user: {
            model: 'user',
            required: true
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['action', 'target', 'resource'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};
