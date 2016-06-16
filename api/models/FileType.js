"use strict";

/**
 * FileType
 * @description :: Model for storing FileType records
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
        api: {
            type: 'boolean',
            defaultsTo: false
        },
        name: {
            type: 'string',
            required: true,
            size: 150,
            minLength: 1
        },
        files: {
            collection: 'file',
            via: 'type'
        },

        toJSON() {
            return this.toObject();
        }
    },
    baseAttributes: {
        name: {
            type: 'string'
        },
        api: {
            type: 'boolean'
        },
        files: {
            type: 'object'
        },
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
    searchables: ['name'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};