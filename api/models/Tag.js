"use strict";

/**
 * Tag
 * @description :: Model for storing Tag records
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
            unique: true,
            size: 100,
            minLength: 1
        },
        slug: {
            type: 'string'
        },
        files: {
            collection: 'file',
            via: 'tags'
        },
        datasets: {
            collection: 'dataset',
            via: 'tags'
        },
        createdBy: {
            model: 'user',
            required: true
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name'],

    beforeUpdate: (values, next) => {
        if (values.name) {
            values.slug = slug(values.name, {lower: true});
        }
        next()
    },
    beforeCreate: (values, next) => {
        if (values.name) {
            values.slug = slug(values.name, {lower: true});
        }
        next()
    }
};
