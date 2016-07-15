"use strict";

/**
 * MapController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    create: function(req, res) {
        const values = actionUtil.parseValues(req);
        // find the fileid within the parameters
        var fileId = _.get(values, 'file', '');
        var latitude = _.get(values, 'latitudeKey', '');
        var longitude = _.get(values, 'longitudeKey', '');

        var properties = _.get(values, 'properties', '');

        var propertiesArray = _.split(properties, ',');

        if (fileId === '') return res.notFound();
        // look for the file with given id
        File.findOne(fileId).exec(function(err, record) {
            if (err) return res.negotiate(err);
            // fetch the collection data of the file
            FileContentsService.mongoContents(record.dataset, record.name, 0, 0, res, function(data) {
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
                    //geojson data
                    var point = {
                            geometry: {
                                type: "Point",
                                coordinates: [value[latitude], value[longitude]]
                            },
                            type: 'Feature',
                            id: index + 1,
                            properties: propertiesMap
                        }
                        // console.dir(point.geometry)
                    geoJson.features.push(point);
                })
                values.geojson = geoJson;
                // Once the geoJson is created, we create the map
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
                            record: req.host + ':' + req.port + '/maps/' + newInstance.id
                        }
                    });
                });
            });


        })
    }
};