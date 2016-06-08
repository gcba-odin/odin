"use strict";

/**
 * Status
 * @description :: Model for storing Status records
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
        name: {
            type: 'string',
            required: true,
            size: 150,
            minLength: 1
        },
        files: {
            collection: 'file',
            via: 'status'
        },
        datasets: {
            collection: 'dataset',
            via: 'status'
        },

        toJSON() {
            return this.toObject();
        }
    },
    baseAttributes: {
        name: {
            type: 'string'
        },
        files: {
            type: 'object'
        },
        datasets: {
            type: 'object'
        }
    },
    setAttributes() {
        return this.baseAttributes
    },
    getAttributes() {
        return _.merge({
            id: {
                type: 'string'
            },
            createdAt: {
                type: 'datetime'
            },
            updatedAt: {
                type: 'datetime'
            }
        }, this.baseAttributes)
    },
    serchables: ['name'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};