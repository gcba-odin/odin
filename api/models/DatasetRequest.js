"use strict";

/**
 * Tag
 * @description :: Model for storing Tag records
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
        about: {
            type: 'string'
        },
        categories: {
            collection: 'category',
            via: 'requests'
        },
        description: {
            type: 'string'
        },
        email: {
            type: 'email',
            unique: true,
            email: true,
            size: 250
        },
        toJSON() {
            return this.toObject();
        }
    }
};
