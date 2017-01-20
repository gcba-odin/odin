"use strict";

/*
 This service updates the related visualizations of a given file
 The visualizations are updated only if they are made via Odin ( if no link is present )
 When a file is updated, either from a WS or from a physical file this service should be called
 */

const shortid = require('shortid');
const _ = require('lodash');

module.exports = {
    update: function(file) {
        if (shortid.isValid(file.id)) {

            // Find the file content on mongo with the data to update the visualizations
            DataStorageService.mongoContents(file.dataset, file.fileName, 0, 0, null, function(data) {
                this.updateMaps(data);
                this.updateKmlMaps(data);
                this.updateCharts(data)
            }.bind(this))
        }
    },
    updateMaps: function(data) {
        // Find all the related maps
        _Map.find({
            file: file.id,
            kml: false
        }).then(function(maps) {
            _.forEach(maps, function(map) {

                // If the map doesn't have a link we procced to update it
                if (!map.link) {
                    VisualizationsUpdateService.updateGeoJson(map, data)
                }
            });
        });
    },
    updateGeoJson(map, data) {
        var propertiesArray = _.split(map.properties, ',');
        var longitude = map.longitudeKey;
        var latitude = map.latitudeKey;
        sails.controllers.map.generateGeoJson(data, latitude, longitude, propertiesArray,
            function(geojson, incorrect, correct) {
                _Map.update({
                    id: map.id
                }, {
                    geojson: geojson
                }).then(function(updated) {});
            })

    },

    updateKmlMaps: function(data) {
        // If file is kml, it can have a related map
        _Map.find({
            file: file.id,
            kml: true
        }).then(function(maps) {
            if (!_.isEmpty(maps)) {
                File.find(file.id).populate('dataset').then(function(file) {
                    sails.controllers.map.kmlToGeoJson(file, function(geojson) {
                        _Map.update({
                            id: map.id
                        }, {
                            geojson: geojson
                        }).then(function(updated) {});
                    })
                })
            }

        });
    },
    updateCharts: function(data) {
        // Find all the related charts
        Chart.find({
            file: file.id
        }).then(function(charts) {
            _.forEach(charts, function(chart) {
                // If the chart doesn't have a link we procced to update it
                if (!chart.link) {
                    VisualizationsUpdateService.updateChartData(data, chart)
                }
            });
        })
    },
    updateChartData(data, chart) { // get the needed data to create the cart
        var dataSeries = _.split(chart.dataSeries, ',');
        var element1 = dataSeries[0];
        var element2 = dataSeries[1];

        // call the method to create the chart
        sails.controllers.chart.generateChartData(data, chart.dataType, element1, element2, function(chartData) {
            var data = {
                labels: _.keys(chartData),
                data: (chart.dataType === 'quantitative') ? _.values(chartData) : _.map(_.values(chartData), _.size)
            };
            Chart.update({
                id: chart.id
            }, {
                data: data
            }).then(function(updated) {});
        });
    }
};
