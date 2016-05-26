"use strict";

/**
 * File
 * @description :: Model for storing File records
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
        url: {
            type: 'string',
            size: 500
        },
        visible: {
            type: 'boolean'
        },
        publishedAt: {
            type: 'datetime'
        },
        type: {
            model: 'filetype',
            required: true
        },
        updateFrequency: {
            model: 'updatefrequency',
            required: true
        },
        status: {
            model: 'status',
            required: true
        },
        organization: {
            model: 'organization',
            required: true
        },
        dataset: {
            model: 'dataset',
            required: true
        },
        owner: {
            model: 'user',
            required: true
        },
        createdBy: {
            model: 'user',
            required: true
        },

        toJSON() {
            return this.toObject();
        }
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};