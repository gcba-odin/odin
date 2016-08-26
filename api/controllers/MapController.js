"use strict";

/**
 * MapController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    publish: function(req, res) {
        const pk = actionUtil.requirePk(req);
        return PublishService.publishModel(_Map, pk, 'publishedStatus', res)
    },
    unpublish: function(req, res) {
        const pk = actionUtil.requirePk(req);
        return PublishService.publishModel(_Map, pk, 'unpublishedStatus', res)
    },
    create: function(req, res) {
        const values = actionUtil.parseValues(req);
        // find the fileid within the parameters
        var fileId = _.get(values, 'file', '');
        var latitude = _.get(values, 'latitudeKey', '');
        var longitude = _.get(values, 'longitudeKey', '');

        var properties = _.get(values, 'properties', '');

        var propertiesArray = _.split(properties, ',');

        var link = _.get(values, 'link', null);

        if (fileId === '') return res.notFound();

        // look for the file with given id
        File.findOne(fileId).exec(function(err, record) {
            if (err) return res.negotiate(err);

            if (link !== null) {
                this.mapCreate(values, req, res)
            } else {

                // fetch the collection data of the file
                FileContentsService.mongoContents(record.dataset, record.fileName, 0, 0, res, function(data) {

                    this.generateGeoJson(data, latitude, longitude, propertiesArray,
                        function(geoJson, incorrect, correct) {
                            values.geojson = geoJson;
                            // Once the geoJson is created, we create the map
                            UploadService.metadataSave(_Map, values, 'maps', req, res, {
                                incorrect: incorrect,
                                correct: correct
                            });

                        }.bind(this));
                }.bind(this));
            }
        }.bind(this));
    },

    update: function(req, res) {
        const values = actionUtil.parseValues(req);
        // find the fileid within the parameters
        var fileId = _.get(values, 'file', '');
        var latitude = _.get(values, 'latitudeKey', '');
        var longitude = _.get(values, 'longitudeKey', '');

        var properties = _.get(values, 'properties', '');

        var propertiesArray = _.split(properties, ',');

        var link = _.get(values, 'link', null);

        if (fileId === '') return res.notFound();

        // look for the file with given id
        File.findOne(fileId).exec(function(err, record) {
            if (err) return res.negotiate(err);

            if (link !== null) {
                UploadService.metadataUpdate(_Map, values, 'maps', req, res);
            } else {
                // fetch the collection data of the file
                FileContentsService.mongoContents(record.dataset, record.fileName, 0, 0, res, function(data) {

                    this.generateGeoJson(data, latitude, longitude, propertiesArray,
                        function(geoJson, incorrect, correct) {
                            values.geojson = geoJson;
                            // Once the geoJson is created, we create the map
                            UploadService.metadataUpdate(_Map, values, 'maps', req, res, {
                                incorrect: incorrect,
                                correct: correct
                            });
                        });
                }.bind(this));
            }
        }.bind(this));
    },


    generateGeoJson(data, latitude, longitude, propertiesArray, cb) {
        var incorrect = 0;
        var correct = 0;
        var geoJson = {
            type: "FeatureCollection",
            features: []
        };

        _.forEach(data, function(value, index) {
            var propertiesMap = {};
            // for each property sent we add it to the map
            _.forEach(propertiesArray, function(property) {
                propertiesMap[property] = value[property];
            });
            // if commas are present, replace them with dots
            value[longitude] = _.replace(value[longitude], ',', '.');
            value[latitude] = _.replace(value[latitude], ',', '.');
            if (!_.isNumber(value[longitude]) || !_.isNumber(value[latitude])) {
                incorrect++;
            } else {
                correct++;
                var point = {
                    geometry: {
                        type: "Point",
                        coordinates: [value[longitude], value[latitude]]
                    },
                    type: 'Feature',
                    id: index + 1,
                    properties: propertiesMap
                };
                geoJson.features.push(point);
            }
        });
        cb(geoJson, incorrect, correct);
    },

    mapCreate: function(values, req, res) {
        _Map.create(values).exec(function created(err, newInstance) {
            if (err) return res.negotiate(err);

            if (req._sails.hooks.pubsub) {
                if (req.isSocket) {
                    Model.subscribe(req, newInstance);
                    Model.introduce(newInstance);
                }
                // Make sure data is JSON-serializable before publishing
                var publishData = _.isArray(newInstance) ?
                    _.map(newInstance, function(instance) {
                        return instance.toJSON();
                    }) :
                    newInstance.toJSON();
                Model.publishCreate(publishData, !req.options.mirror && req);
            }

            // Send JSONP-friendly response if it's supported
            res.created(newInstance, {
                meta: {
                    code: sails.config.success.CREATED.code,
                    message: sails.config.success.CREATED.message
                },
                links: {
                    record: sails.config.odin.baseUrl + '/maps/' + newInstance.id,
                    all: sails.config.odin.baseUrl + '/maps'
                }
            });
        });
    }

};