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
            type: 'integer',
            autoIncrement: true,
            unique: true,
            index: true,
            primaryKey: true
        },
        file: {
            type: 'string',
            size: 15
        },
        finish: {
            type: 'boolean',
            defaultsTo: false
        },
        new: {
            type: 'boolean',
            defaultsTo: true
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
