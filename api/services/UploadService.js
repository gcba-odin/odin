/*
 * This service handles the file uploads. It also checks if the file is a text file, and if so encodes it using the default specified in config/odin.js
 * And, if the file contents can be exposed via the API, inserts it into MongoDB.
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
        if (!shortid.isValid(dataset)) return res.badRequest('Dataset can contain only numbers and letters');

        console.log("isNoop: " + uploadFile.isNoop);

        if (!uploadFile.isNoop) {

            uploadFile.upload({
                    saveAs: function(file, cb) {
                        //Get the extension of the file
                        extension = mime.lookup(file.filename.split('.').pop());

                        // If the extension is present on the array of allowed types we can save it
                        if (sails.config.odin.allowedTypes.indexOf(extension) === -1) {
                            console.log('filetype not allowed');
                            return res.badRequest('filetype not allowed');
                        } else {
                            filename = file.filename;
                            console.log('before cb');
                            cb(null, file.filename);
                        }
                    },
                    dirname: require('path').resolve(sails.config.odin.uploadFolder + '/' + dataset),
                    maxBytes: 2000000000,

                },
                function onUploadComplete(err, files) {
                    console.log('on upload complete');
                    console.log(files.length);
                    console.log(files);
                    //	IF ERROR Return and send 500 error with error
                    if (err) return res.serverError(err);
                    if (files.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }
                    if (/^text\/\w+$/.test(extension)) {

                        var filePath = sails.config.odin.uploadFolder + "/" + dataset + '/' + filename;

                        fs.createReadStream(filePath)
                            .pipe(iconv.decodeStream('utf8')).collect(function(err, result) {
                                if (err) return res.negotiate(err);

                                var withBOM = '\ufeff' + result;

                                if (extension == 'text/csv') {
                                    converter.fromString(result, function(err, json) {
                                        if (err) {
                                            return res.negotiate(err);
                                        }
                                        if (json.length === 0) return res.badRequest("Invalid or empty csv.");
                                        // Retrieve
                                        var MongoClient = require('mongodb').MongoClient;

                                        // Connect to the db
                                        // TODO: Put the mongo URL in config/odin.js, separated (host and port, host NOT including the mongodb:// bit)
                                        MongoClient.connect("mongodb://localhost:27017/" + dataset, function(err, db) {
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

                                fs.writeFile(filePath, withBOM, function() {});
                            });

                        var data = actionUtil.parseValues(req)
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
                }
            )
        } else {
            return res.badRequest('No file was uploaded.');
        }
        /*
        var extension = '';
        var filename = '';
        var uploadFile = req.file('uploadFile').on('error', function(err) {
            console.log("uploadFile err: " + err);
            if (!res.headersSent) return res.negotiate(err);
        });
        var dataset = req.param('dataset');

        if (!shortid.isValid(dataset)) return res.badRequest('Dataset can contain only numbers and letters');

        if (!uploadFile.isNoop) {
            uploadFile.upload({
                saveAs: function(file, cb) {
                    //Get the extension of the file
                    extension = mime.lookup(file.filename.split('.').pop());
                    checkExtension(file, extension, cb);
                },
                dirname: path.resolve(sails.config.odin.uploadFolder + '/' + dataset),
                maxBytes: 2000 * 1000 * 1000
            }, onUploadComplete(err, files, filename));
        }
        */
    }
}