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
            url: true,
            size: 500
        },
        
        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name']
};
