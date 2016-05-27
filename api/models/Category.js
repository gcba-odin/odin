"use strict";

/**
 * Category
 * @description :: Model for storing Category records
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
            size: 150
        },
        description: {
            type: 'string',
            size: 350
        },
        active: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        createdBy: {
            model: 'user',
            required: true
        },
        datasets: {
            collection: 'dataset',
            via: 'category'
        },

        toJSON() {
            return this.toObject();
        }
    },
    baseAttributes: {
        name: {
            type: 'string'
        },
        description: {
            type: 'email'
        },
        active: {
            type: 'string'
        },
        createdBy: {
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

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};
