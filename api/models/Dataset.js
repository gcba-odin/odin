"use strict";

/**
 * Dataset
 * @description :: Model for storing Dataset records
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
        notes: {
            type: 'string',
            size: 500
        },
        visibility: {
            type: 'boolean'
        },
        starred: {
            type: 'boolean'
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
        organization: {
            model: 'organization'
        },
        createdBy: {
            model: 'user'
        },
        status: {
            model: 'status'
        },
        files: {
            collection: 'file',
            via: 'dataset'
        },
        toJSON() {
            return this.toObject();
        }
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};
