"use strict";

/**
 * Organization
 * @description :: Model for storing Organization records
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
        name: {
            type: 'string',
            required: true,
            unique: true,
            size: 150,
            minLength: 1
        },
        slug: {
            type: 'string'
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
        children: {
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

    searchables: ['name', 'description'],

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