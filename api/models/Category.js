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
            unique: true,
            required: true,
            size: 150,
            minLength: 1
        },
        description: {
            type: 'string',
            size: 350,
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
    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => {
        next()
    }
};