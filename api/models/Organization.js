"use strict";

/**
 * Organization
 * @description :: Model for storing Organization records
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
        description: {
            type: 'string',
            size: 350
        },
        address: {
            type: 'string',
            size: 150
        },
        createdBy: {
            model: 'user'
        },
        users: {
            collection: 'user',
            via: 'organization'
        },
        parent: {
            model: 'organization'
        },
        childs: {
            collection: 'organization',
            via: 'parent'
        },
        files: {
            collection: 'file',
            via: 'organization'
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
            type: 'string'
        },
        adress: {
            type: 'string'
        },
        createdBy: {
            type: 'object'
        },
        users: {
            type: 'object'
        },
        parent: {
            type: 'object'
        },
        childs: {
            type: 'object'
        },
        files: {
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
    serchables: ['name', 'description'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};