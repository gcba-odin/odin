"use strict";

/**
 * TagController
 * @description :: Server-side logic for ...
 */
const _ = require('lodash');
module.exports = {
    getByCategories: (req, res) => {
        Metric.find(function(err, metrics) {

            var rows = {}
            metrics.forEach(function(dataset) {
                var datasetId = dataset.dataset;
                var datasetCount = dataset.count;
                rows[datasetId] = datasetCount
            });

            let datasetsId = _.map(metrics, 'dataset')

            Dataset.find().populate('categories').where({id: datasetsId}).then(function(datasets) {
                var statistics = {}
                statistics.total = 0;
                _.forEach(datasets, function(dataset) {
                    _.forEach(dataset.categories, function(category) {
                        if (_.isUndefined(statistics[category.id])) {
                            statistics[category.id] = 0
                        }
                        statistics['total'] += rows[dataset.id]

                        statistics[category.id] += rows[dataset.id]
                    })
                })
                return res.ok(statistics)
            });
        })

    }
};
