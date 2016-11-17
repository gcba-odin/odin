"use strict";

/**
 * Dataset
 * @description :: Model for storing Dataset records
 */

var shortId = require('shortid');
var slug = require('slug');
var fs = require('fs');

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
        slug: {
            unique: true,
            type: 'string'
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
        optionals: {
            type: 'json'
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
        deletedAt: {
            type: 'datetime'
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

    removeEmptyAssociations: true,

    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => {

        if (values.id) {

            Dataset.find(values.id).limit(1).then(function (originalDataset) {
                originalDataset = originalDataset[0];

                if (originalDataset.name !== values.name) {

                    var originalDirname = sails.config.odin.uploadFolder + "/" + slug(originalDataset.name, {
                            lower: true
                        });
                    var newDirname = sails.config.odin.uploadFolder + "/" + slug(values.name, {
                            lower: true
                        });
                    fs.rename(originalDirname, newDirname, function (err) {
                        if (err) throw err;
                        console.log('Datasets folder renamed');
                    });
                }
            });

        }
        if (values.name) {
            values.slug = slug(values.name, {lower: true});
        }
        next()
    },
    beforeCreate: (values, next) => {
        if (values.name) {
            values.slug = slug(values.name, {lower: true});
        }
        Config.findOne({
            key: 'defaultStatus'
        }).exec(function (err, record) {
            values.status = record.value;
            next();
        });
    },
    afterCreate: (values, next) => next()
};
