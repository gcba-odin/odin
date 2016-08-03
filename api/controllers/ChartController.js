"use strict";

/**
 * ChartController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');


module.exports = {

    create: function(req, res) {

        const values = actionUtil.parseValues(req);

        var fileId = _.get(values, 'file', '');
        var type = _.get(values, 'type', '');
        var subtype = _.get(values, 'subtype', '');
        var element1 = _.get(values, 'element1', '');
        var element2 = _.get(values, 'element2', '');


        File.findOne(fileId).exec(function(err, record) {
            if (err) return res.negotiate(err);
            FileContentsService.mongoContents(record.dataset, record.fileName, 0, 0, res, function(table) {

                if (subtype === 'qualitative') {
                    console.log('qualitative chart');
                    var chartData = _.groupBy(table, function(value) {
                        return value[element1];
                    });
                    _.each(chartData, function(val, key) {
                        console.log('\nkey = ' + key)
                        console.log('val = ' + _.size(val))
                    })
                    var serie = _.keys(chartData);
                    var labels = _.values(chartData);
                } else {
                    if (subtype === 'quantitative') {
                        console.log('quantitative chart');
                        chartData = _.transform(data, function(result, value) {
                            var key = value[element1]
                            var val = value[element2]
                            result[key] = val;
                        }, {});
                        console.log('chart data = ' + chartData);
                    }

                }
            });
        });
    }

};