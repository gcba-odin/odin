"use strict";

/**
 * Metric
 * @description :: Model for storing Metric records
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
        file: {
            type: 'string',
            unique: true,
            size: 15
        },
        finish: {
            type: 'boolean',
            defaultsTo: false
        },
        priority: {
            type: 'boolean',
            defaultsTo: false
        },
        endDate: {
            type: 'datetime',
            defaultsTo: null
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: [],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};
