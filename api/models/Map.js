"use strict";

/**
 * Map
 * @description :: Model for storing Map records
 */

var shortId = require('shortid');

module.exports = {
    schema: true,
    globalId: '_Map',

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
        basemap: {
            type: 'string',
            required: true,
            enum: ['roadmap', 'satellite', 'hybrid', 'terrain']
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
        latitudeKey: {
            type: 'string',
            size: 100
                // required: true
        },
        longitudeKey: {
            type: 'string',
            size: 100
                // required: true
        },
        geojson: {
            type: 'json'
        },
        publishedAt: {
            type: 'datetime'
        },
        file: {
            model: 'file',
            required: true
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
        values.url = _.replace(values.url, 'model', 'maps');
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