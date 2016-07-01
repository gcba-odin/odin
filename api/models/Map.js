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
        createdBy: {
            model: 'user'
                // required: true
        },
        embedCode: {
            type: 'string',
            size: 500
        },
        latitudeKey: {
            type: 'string',
            size: 100
        },
        longitudeKey: {
            type: 'string',
            size: 100
        },
        geojson: {
            type: 'json'
        },
        toJSON() {
            return this.toObject();
        }
    },
    baseAttributes: {
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        notes: {
            type: 'string'
        },
        basemap: {
            type: 'string'
        },
        url: {
            type: 'string'
        },
        createdBy: {
            type: 'object'
        },
        embedCode: {
            type: 'string'
        },
        latitudeKey: {
            type: 'string'
        },
        longitudeKey: {
            type: 'string'
        },
        geojson: {
            type: 'json'
        }

    },
    setAttributes() {
        return this.baseAttributes
    },
    getAttributes() {
        return _.merge({
            id: {
                type: 'string'
            },
            createdAt: {
                type: 'datetime'
            },
            updatedAt: {
                type: 'datetime'
            }
        }, this.baseAttributes)
    },
    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => {
        values.url = _.replace(values.url, 'model', 'maps');
        values.url = _.replace(values.url, 'id', values.id);
        next();
    },
    afterUpdate: (values, next) => {
        next()
    },
    afterCreate: (values, next) => {
        next();
    },
    afterDestroy: (destroyedRecords, next) => {
        next();
    }
};