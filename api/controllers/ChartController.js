"use strict";

/**
 * ChartController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const _ = require('lodash');


module.exports = {
    unpublish: function(req, res) {
        const pk = actionUtil.requirePk(req);
        return PublishService.publishModel(Chart, pk, 'unpublished', res)
    },
    reject: function(req, res) {
        const pk = actionUtil.requirePk(req);
        return PublishService.publishModel(Chart, pk, 'rejected', res)
    },
    create: function(req, res) {
        this.createChart(req, res, function(values) {
            UploadService.metadataSave(Chart, values, 'chart', req, res);
        });
    },
    update: function(req, res) {
        this.createChart(req, res, function(values) {
            UploadService.metadataUpdate(Chart, values, 'chart', req, res);
        });
    },

    createChart: function(req, res, cb) {


        const values = actionUtil.parseValues(req);

        var link = _.get(values, 'link', null);

        if (link !== null) {
            cb(values);
        } else {

            var fileId = _.get(values, 'file', '');
            var type = _.get(values, 'type', '');
            var dataType = _.get(values, 'dataType', '');
            values.dataSeries = _.split(_.get(values, 'dataSeries', ''), ',');

            var element1 = values.dataSeries[0];
            var element2 = values.dataSeries[1];
            // var serie = [element1];
            File.findOne(fileId).exec(function(err, record) {

                if (err) return res.negotiate(err);
                FileContentsService.mongoContents(record.dataset, record.fileName, 0, 0, res, function(table) {
                    this.generateChartData(table, dataType, element1, element2, function(chartData) {
                        values.data = {
                            labels: _.keys(chartData),
                            data: (dataType === 'quantitative') ? _.values(chartData) : _.map(_.values(chartData), _.size)
                        };

                        cb(values);
                    });
                }.bind(this));
            }.bind(this));
        }
    },
    generateChartData: function(data, dataType, element1, element2, cb) {
        var chartData;
        if (dataType === 'qualitative') {

            //if the chart is qualitative we group all the data referenced by the element asked

            chartData = _.groupBy(data, function(value) {
                return value[element1];
            });
        } else {
            if (dataType === 'quantitative') {
                //if the chart is quantitative return associative array

                var groupedData = _.groupBy(data, function(value) {
                    return value[element1];
                });
                chartData = _.transform(groupedData, function(result, value) {
                    var key = value[0][element1];
                    var val = _.sumBy(value, function(each) {
                        // in case a number is like 192.123.522, transform it to 192123522
                        // var withoutDots = _.join(_.split(each[element2], '.'), "");
                        // in case a number is like 192123,522, transform it to 192123.522
                        return _.toNumber(_.replace(each[element2], ',', '.'));

                    });
                    result[key] = _.round(val, 2);
                }, {});
            }
        }
        cb(chartData)
    }
};
