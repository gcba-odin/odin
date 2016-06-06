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

        baseAttributes: {
            api: {
                type: 'boolean'
            },
            name: {
                type: 'string'
            },
            files: {
                collection: 'file',
                via: 'type'
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

        toJSON() {
            return this.toObject();
        }
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};