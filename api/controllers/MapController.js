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
        var pointId = _.get(values, 'pointId', '');
        var x = _.get(values, 'x', '');
        var y = _.get(values, 'y', '');

        var properties = _.get(values, 'properties', '');

        var propertiesArray = _.split(properties, ',');

        if (fileId === '') return res.notFound();
        // look for the file with given id
        File.findOne(fileId).exec(function(err, record) {
            if (err) return res.negotiate(err)
                // fetch the collection data of the file
            FileContentsService.mongoContents(record.dataset, record.name, 0, 0, res, function(data) {
                _.forEach(data, function(value) {
                    var propertiesMap = {};
                    // for each property sent we add it to the map
                    _.foreach(propertiesArray, function(property) {
                            propertiesMap[property] = value[property];
                        })
                        //geojson data
                    var point = {
                        geometry: {
                            type: "Point",
                            coordinates: [value[x], value[y]]
                        },
                        type: 'Feature',
                        id: value[pointId],
                        properties: propertiesMap
                    }
                })
            });

            // DataStorageService.getData(record.dataset, record.name, res, function(data) {
            // console.dir(tojson(data.next()));
            // console.dir(data[0])
            // });

        })
    }
};