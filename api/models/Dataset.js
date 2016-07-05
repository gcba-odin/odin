"use strict";

/**
 * Dataset
 * @description :: Model for storing Dataset records
 */

var shortId = require('shortid');
const fs = require('fs');

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
            unique: true,
            size: 150,
            minLength: 1
        },
        description: {
            type: 'string',
            size: 350
        },
        notes: {
            type: 'string',
            size: 500
        },
        visible: {
            type: 'boolean',
            defaultsTo: false
        },
        starred: {
            type: 'boolean',
            defaultsTo: false
        },
        optional1: {
            type: 'string',
            size: 500
        },
        optional2: {
            type: 'string',
            size: 500
        },
        optional3: {
            type: 'string',
            size: 500
        },
        optional4: {
            type: 'string',
            size: 500
        },
        optional5: {
            type: 'string',
            size: 500
        },
        optional6: {
            type: 'string',
            size: 500
        },
        optional7: {
            type: 'string',
            size: 500
        },
        optional8: {
            type: 'string',
            size: 500
        },
        optional9: {
            type: 'string',
            size: 500
        },
        optional10: {
            type: 'string',
            size: 500
        },
        publishedAt: {
            type: 'datetime'
        },
        category: {
            model: 'category'
        },
        status: {
            model: 'status'
        },
        files: {
            collection: 'file',
            via: 'dataset'
        },
        tags: {
            collection: 'tag',
            via: 'datasets',
            dominant: true
        },
        owner: {
            model: 'user',
            required: true
        },
        createdBy: {
            model: 'user'
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
        notes: {
            type: 'string'
        },
        visible: {
            type: 'boolean'
        },
        starred: {
            type: 'boolean'
        },
        optional1: {
            type: 'string',
            size: 500
        },
        optional2: {
            type: 'string',
            size: 500
        },
        optional3: {
            type: 'string',
            size: 500
        },
        optional4: {
            type: 'string',
            size: 500
        },
        optional5: {
            type: 'string',
            size: 500
        },
        optional6: {
            type: 'string',
            size: 500
        },
        optional7: {
            type: 'string',
            size: 500
        },
        optional8: {
            type: 'string',
            size: 500
        },
        optional9: {
            type: 'string',
            size: 500
        },
        optional10: {
            type: 'string',
            size: 500
        },
        publishedAt: {
            type: 'datetime'
        },
        category: {
            model: 'category'
        },
        status: {
            model: 'status'
        },
        files: {
            collection: 'file',
            via: 'dataset'
        },
        tags: {
            collection: 'tag',
            via: 'datasets',
            dominant: true
        },
        owner: {
            model: 'user',
            required: true
        },
        createdBy: {
            model: 'user'
        }
    },
    setAttributes() {
        return this.baseAttributes;
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
        }, this.baseAttributes);
    },
    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next(),
    afterCreate: (values, next) => next()
};