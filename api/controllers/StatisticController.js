"use strict";

/**
 * StatisticController
 * @description :: Server-side logic for ...
 */
const _ = require('lodash');

module.exports = {
    // downloads(req, res) {
    //     Statistic.query('select * from downloads()', function(err, result) {
    //         var statistics = result.rows;
    //         var rows = {}
    //         statistics.forEach(function(dataset) {
    //             var datasetId = dataset.dataset[0];
    //             var datasetCount = dataset.count;
    //             rows[datasetId] = datasetCount
    //         });
    //
    //         var datasetsId = _.keys(rows)
    //
    //         Dataset.find().populate('categories').where({id: datasetsId}).then(function(datasets) {
    //             var total = {}
    //             total.total = 0;
    //             _.forEach(datasets, function(dataset) {
    //                 console.log(rows)
    //                 total['total'] += rows[dataset.id]
    //                 _.forEach(dataset.categories, function(category) {
    //                     if (_.isUndefined(total[category.id])) {
    //                         total[category.id] = 0
    //                     }
    //                     total[category.id] += rows[dataset.id]
    //                 })
    //             })
    //             return res.ok(total)
    //         })

    //     Category.find().populate('datasets', 'id').exec(function(err, records) {
    //         console.log(records)
    //         var groupped = _.groupBy(records, function(record) {
    //             return record.category
    //         });
    //         console.log(groupped)
    //         var links = {
    //             all: sails.config.odin.baseUrl + '/datasets'
    //         };
    //
    //         var meta = {
    //             code: sails.config.success.OK.code,
    //             message: sails.config.success.OK.message
    //         };
    //         return res.ok(groupedByModel, {
    //             links: links,
    //             meta: meta
    //         })
    //
    //     });
    //
    // })
    // }
}
