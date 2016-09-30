"use strict";

/**
 * FileType
 * @description :: Model for storing FileType records
 */

var shortId = require('shortid');
var slug = require('slug');

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
        slug: {
            type: 'string'
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

    beforeUpdate: (values, next) => {
        if (values.name) {
            values.slug = slug(values.name, {
                lower: true
            });
        }
        next()
    },
    beforeCreate: (values, next) => {
        if (values.name) {
            values.slug = slug(values.name, {
                lower: true
            });
        }
        next()
    }
};