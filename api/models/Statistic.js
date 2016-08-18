"use strict";

/**
 * Statistic
 * @description :: Model for storing Statistic records
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
        method: {
            type: 'string',
            required: true,
            enum: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
        },
        resource: {
            type: 'string',
            size: 50
        },
        endpoint: {
            type: 'string',
            required: true,
            size: 300
        },
        querystring: {
            type: 'string',
            size: 1000
        },
        client: {
            type: 'string',
            // required: true,
            size: 100
        },
        useragent: {
            type: 'string',
            required: true,
            size: 1000
        },
        ip: {
            type: 'string',
            required: true,
            size: 46
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: [],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};