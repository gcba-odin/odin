"use strict";

/**
 * ChartController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');


module.exports = {

    create: function (req, res) {

        const values = actionUtil.parseValues(req);

        var fileId = _.get(values, 'file', '');
        var type = _.get(values, 'type', '');
        var subtype = _.get(values, 'subtype', '');

        var element = _.get(values, 'element', '');
        var element1 = _.get(values, 'element1', '');
        var element2 = _.get(values, 'element2', '');

        element1 = element;

        // var serie = [element1];

        File.findOne(fileId).exec(function (err, record) {
            if (err) return res.negotiate(err);
            FileContentsService.mongoContents(record.dataset, record.fileName, 0, 0, res, function (table) {

                if (subtype === 'quantitative') {
                    console.log('quantitative chart');

                    //if the map is qualitative we group all the data referenced by the element asked

                    var chartData = _.groupBy(table, function (value) {
                        return value[element1];
                    });
                } else {
                    if (subtype === 'qualitative') {
                        console.log('qualitative chart');
                        //if the chart is quantitative return associative array
                        var chartData = _.transform(table, function (result, value) {
                            var key = value[element1];
                            var val = value[element2];
                            result[key] = val;
                        }, {});
                        console.log('chart data = ' + chartData);
                    }

                }
                values.data = {
                    labels: _.keys(chartData),
                    data: _.map(_.values(chartData),_.size)
                };
                console.dir(values.data)

                UploadService.metadataSave(Chart, values, 'chart', req, res);

            });
        });
    }

};
