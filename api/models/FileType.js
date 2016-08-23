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
            unique: true,
            size: 150,
            minLength: 1
        },
        mimetype: {
            type: 'string',
            size: 200
        },
        files: {
            collection: 'file',
            via: 'type'
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};