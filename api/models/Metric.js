"use strict";

/**
 * Metric
 * @description :: Model for storing Metric records
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
        dataset: {
            type: 'string',
            size: 15
        },
        count: {
            type: 'integer'
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: [],

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next(),

    updateOrCreateMetric: (dataset) => {
        Metric.findOne({dataset: dataset}).exec(function(err, record) {
            if (err)
                console.log(err)
                // if record exists update the existing one
            console.log('record ', record)
            if (record) {
                record.count++;
                Metric.update(record.id, record).exec(function(err, record) {})
            } else {
                Metric.create({dataset: dataset, count: 1}).exec(function(err, record) {})
            }
        })
    }
};
