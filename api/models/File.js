"use strict";

/**
 * File
 * @description :: Model for storing File records
 */

var shortId = require('shortid');
const fs = require('fs');

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
        fileName: {
            type: 'string',
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
        collection: {
            type: 'string',
            size: 500
        },
        visible: {
            type: 'boolean',
            defaultsTo: false
        },
        url: {
            type: 'string',
            url: true,
            size: 500
        },
        publishedAt: {
            type: 'datetime'
        },
        gatheringDate: {
            type: 'date'
        },
        updateDate: {
            type: 'datetime'
        },
        updated: {
            type: 'boolean',
            defaultsTo: false
        },
        type: {
            model: 'filetype'
                // required: true
        },
        updateFrequency: {
            model: 'updatefrequency',
            required: true
        },
        status: {
            model: 'status'
        },
        organization: {
            model: 'organization',
            required: true
        },
        optionals: {
            type: 'json'
        },
        dataset: {
            model: 'dataset'
                // required: true
        },
        tags: {
            collection: 'tag',
            via: 'files',
            dominant: true
        },
        owner: {
            model: 'user',
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

        Config.findOne({
            key: 'defaultStatus'
        }).exec(function(err, record) {
            values.status = record.value;

            if (_.endsWith(values.url, '/id')) {

                values.url = _.replace(values.url, 'model', 'files');
                values.url = _.replace(values.url, 'id', values.id);
                values.url = values.url + '/download';
            }
            next();
        });



    },
    afterUpdate: (values, next) => {
        if (values.dataset) ZipService.createZip(values.dataset);
        next();
    },
    afterCreate: (values, next) => {
        if (values.dataset) ZipService.createZip(values.dataset);
        next();
    },
    afterDestroy: (destroyedRecords, next) => {
        if (!_.isEmpty(destroyedRecords)) {
            destroyedRecords = destroyedRecords[0];
            UnpublishService.unpublish(destroyedRecords);
            var path = sails.config.odin.uploadFolder + '/' + destroyedRecords.dataset + '/' + destroyedRecords.name;
            fs.unlink(path, function() {
                DataStorageService.deleteCollection(destroyedRecords.dataset, destroyedRecords.name, next);
                ZipService.createZip(destroyedRecords.dataset);
            });
        }
        next();
    }
};