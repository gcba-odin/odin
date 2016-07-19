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
            size: 350
        },

        image: {
            type: 'string',
            url: true,
            size: 500
        },
        color: {
            type: 'string',
            size: 6
        },
        createdBy: {
            model: 'user',
            required: true
        },
        datasets: {
            collection: 'dataset',
            via: 'categories'
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => {
        next();
    }
};