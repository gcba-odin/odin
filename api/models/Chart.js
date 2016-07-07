"use strict";

/**
 * Chart
 * @description :: Model for storing Chart records
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
        notes: {
            type: 'string',
            size: 500
        },
        url: {
            type: 'string',
            url: true,
            size: 500
        },
        embedCode: {
            type: 'string',
            size: 500
        },
        publishedAt: {
            type: 'datetime'
        },
        createdBy: {
            model: 'user'
                // required: true
        },
        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => {
        values.url = _.replace(values.url, 'model', 'charts');
        values.url = _.replace(values.url, 'id', values.id);
        next();
    },
    afterUpdate: (values, next) => {
        next();
    },
    afterCreate: (values, next) => {
        next();
    },
    afterDestroy: (destroyedRecords, next) => {
        next();
    }
};