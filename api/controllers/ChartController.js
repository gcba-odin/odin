"use strict";

/**
 * ChartController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');


module.exports = {

    create: function (req, res) {
        this.createChart(req, res,function (values) {
            UploadService.metadataSave(Chart, values, 'chart', req, res);
        });
    },
    update: function (req, res) {
        this.createChart(req,res, function (values) {
            UploadService.metadataUpdate(Chart, values, 'chart', req, res);
        });
    },

    createChart: function (req,res, cb) {


        const values = actionUtil.parseValues(req);

        var link = _.get(values, 'link', '');

        if (link !== '') {
            cb(values)
        }
        else {

            var fileId = _.get(values, 'file', '');
            var type = _.get(values, 'type', '');
            var dataType = _.get(values, 'dataType', '');

            var dataSeries = _.split(_.get(values, 'dataSeries', ''), ',');

            var element1 = dataSeries[0];
            var element2 = dataSeries[1];
            console.dir(element1)
            console.dir(element2)
            // var serie = [element1];

            File.findOne(fileId).exec(function (err, record) {
                if (err) return res.negotiate(err);
                FileContentsService.mongoContents(record.dataset, record.fileName, 0, 0, res, function (table) {

                    if (dataType === 'quantitative') {
                        console.log('quantitative chart');

                        //if the map is qualitative we group all the data referenced by the element asked

                        var chartData = _.groupBy(table, function (value) {
                            return value[element1];
                        });
                    } else {
                        if (dataType === 'qualitative') {
                            console.log('qualitative chart');
                            //if the chart is quantitative return associative array
                            var chartData = _.transform(table, function (result, value) {
                                var key = value[element1];
                                var val = value[element2];
                                console.dir(val)
                                result[key] = val;
                            }, {});
                        }
                    }
                    values.data = {
                        labels: _.keys(chartData),
                        data: (dataType === 'qualitative') ? _.values(chartData) : _.map(_.values(chartData), _.size)
                    };

                    cb(values)

                });
            });
        }
    }
};
