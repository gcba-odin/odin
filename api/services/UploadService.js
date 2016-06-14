/*
 * This service handles the file uploads. Performs validation and encodes text files with the encoding specified in config/odin.js.
 * And, if the file contents can be exposed via the API, inserts them into the non relational database.
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const mime = require('mime');
const Converter = require("csvtojson").Converter;
const converter = new Converter({
    delimiter: 'auto'
});
const iconv = require('iconv-lite');

module.exports = {
    uploadFile: function(req, res) {
        var extension = '';
        var filename = '';
        var uploadFile = req.file('uploadFile').on('error', function(err) {
            if (!res.headersSent) return res.negotiate(err);
        });
        var dataset = req.param('dataset');

        // Check if the dataset ID is valid
        if (!shortid.isValid(dataset)) return res.badRequest('Dataset can contain only numbers and letters');
        // If there is a file
        if (!uploadFile.isNoop) {
            uploadFile.upload({
                    saveAs: function(file, cb) {
                        //Get the extension of the file
                        extension = mime.lookup(file.filename.split('.').pop());

                        // If the extension is present on the array of allowed types we can save it
                        if (sails.config.odin.allowedTypes.indexOf(extension) === -1) {
                            return res.badRequest('filetype not allowed');
                        } else {
                            filename = file.filename;
                            cb(null, file.filename);
                        }
                    },
                    dirname: require('path').resolve(sails.config.odin.uploadFolder + '/' + dataset),
                    maxBytes: 2000000000,

                },
                function onUploadComplete(err, files) {
                    //	IF ERROR Return and send 500 error with error
                    if (err) return res.serverError(err);
                    if (files.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }

                    // Check if the upload is a textfile (via mimetype)
                    if (/^text\/\w+$/.test(extension)) {
                        var filePath = sails.config.odin.uploadFolder + "/" + dataset + '/' + filename;

                        // Read the file
                        fs.createReadStream(filePath)
                            // Encode it
                            .pipe(iconv.decodeStream(sails.config.odin.defaultEncoding)).collect(function(err, result) {
                                if (err) return res.negotiate(err);
                                if (sails.config.odin.defaultEncoding === 'utf8') result = '\ufeff' + result;

                                // If the file is consumable via the API
                                if (extension == 'text/csv') {
                                    // Convert to JSON
                                    converter.fromString(result, function(err, json) {
                                        if (err) {
                                            return res.negotiate(err);
                                        }
                                        if (json.length === 0) return res.badRequest("Invalid or empty csv.");

                                        var MongoClient = require('mongodb').MongoClient;

                                        // Connect to the db
                                        // TODO: Put the mongo URL in config/odin.js, separated (host and port, host NOT including the mongodb:// bit)
                                        // TODO: Put the connection and insert logic in a service (DataStorageService), and just call it from here
                                        MongoClient.connect("mongodb://" + sails.config.odin.filesDb.host + ":" +
                                            sails.config.odin.filesDb.port + "/" + dataset,
                                            function(err, db) {
                                                if (err) return res.negotiate(err);

                                                var collection = db.collection(files[0].filename);

                                                collection.insert(json, {
                                                    w: 1
                                                }, function(err, res) {
                                                    if (err) return res.negotiate(err)
                                                });
                                            });
                                    });
                                }

                                fs.writeFile(filePath, result, function() {});
                            });
                    }

                    var data = actionUtil.parseValues(req);

                    // Save the file metadata to the relational DB
                    File.create(data).exec(function created(err, newInstance) {
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
                        res.created(newInstance);
                    });
                }
            )
        } else {
            return res.badRequest('No file was uploaded.');
        }
    }
};