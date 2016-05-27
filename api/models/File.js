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
            size: 15,
            minLength: 14
        },
        name: {
            type: 'string',
            required: true,
            size: 150,
            minLength: 1
        },
        description: {
            type: 'string',
            size: 350,
            minLength: 3
        },
        notes: {
            type: 'string',
            size: 500,
            minLength: 3
        },
        url: {
            type: 'string',
            url: true,
            size: 500,
            minLength: 3
        },
        visible: {
            type: 'boolean',
            defaultsTo: false
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