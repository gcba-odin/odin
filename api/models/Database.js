"use strict";

/**
 * Database
 * @description :: Model for storing Database records
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
            size: 15,
            minLength: 14
        },
        name: {
            type: 'string',
            required: true,
            size: 150,
            minLength: 1
        },
        collection: {
            type: 'string',
            size: 150,
            minLength: 3
        },
        url: {
            type: 'string',
            url: true,
            size: 500,
            minLength: 3
        },

        toJSON() {
            return this.toObject();
        }
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};