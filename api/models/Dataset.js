"use strict";

/**
 * Dataset
 * @description :: Model for storing Dataset records
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
        visible: {
            type: 'boolean',
            defaultsTo: false
        },
        starred: {
            type: 'boolean',
            defaultsTo: false,
            boolean: true
        },
        // optional1: {
        //     type: 'string',
        //     size: 500
        // },
        // optional2: {
        //     type: 'string',
        //     size: 500
        // },
        // optional3: {
        //     type: 'string',
        //     size: 500
        // },
        // optional4: {
        //     type: 'string',
        //     size: 500
        // },
        // optional5: {
        //     type: 'string',
        //     size: 500
        // },
        // optional6: {
        //     type: 'string',
        //     size: 500
        // },
        // optional7: {
        //     type: 'string',
        //     size: 500
        // },
        // optional8: {
        //     type: 'string',
        //     size: 500
        // },
        // optional9: {
        //     type: 'string',
        //     size: 500
        // },
        // optional10: {
        //     type: 'string',
        //     size: 500
        // },
        optionals: {
            type: 'json'
        },
        disclaimer: {
            type: 'string',
            size: 500
        },
        publishedAt: {
            type: 'datetime'
        },
        categories: {
            collection: 'category',
            via: 'datasets',
            dominant: true
        },
        status: {
            model: 'status'
        },
        files: {
            collection: 'file',
            via: 'dataset'
        },
        tags: {
            collection: 'tag',
            via: 'datasets',
            dominant: true
        },
        owner: {
            model: 'user',
            required: true
        },
        createdBy: {
            model: 'user'
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => {
        Config.findOne({
            key: 'defaultStatus'
        }).exec(function(err, record) {
            values.status = record.value;
            next();
        });
    },
    afterCreate: (values, next) => next()
};