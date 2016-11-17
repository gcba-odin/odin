"use strict";

/**
 * Basemaps
 * @description :: Model for storing Basemaps records
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
        maps: {
            collection: 'map',
            via: 'basemap'
        },
        url: {
            type: 'string',
            size: 500
        },
        attribution: {
            type: 'string'
        },
        tms: {
            type: 'boolean',
            defaultsTo: false
        },
        maxZoom: {
            type: 'integer',
            defaultsTo: 18
        },
        minZoom: {
            type: 'integer',
            defaultsTo: 0
        },
        deletedAt: {
            type: 'datetime'
        },
        createdBy: {
            model: 'user'
        },
        optionals: {
            type: 'json'
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name']
};
