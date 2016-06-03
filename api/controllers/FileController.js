"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var mime = require('mime');
var shortid = require('shortid');
var Converter = require("csvtojson").Converter;
var converter = new Converter({
    delimiter: 'auto'
});

module.exports = {
    upload: function(req, res) {
        var extension = '';
        var filename = ''
        var uploadFile = req.file('uploadFile').on('error', function(err) {
            if (!res.headersSent) return res.negotiate(err);
        });
        var dataset = req.param('dataset');
        if (!shortid.isValid(dataset)) return res.badRequest('Dataset can contain only numbers and letters')
        if (!uploadFile.isNoop) {
            uploadFile.upload({
                    saveAs: function(file, cb) {
                        //Get the extension of the file
                        extension = mime.lookup(file.filename.split('.').pop());
                        // If the extension is present on the array of allowed types we can save it
                        if (sails.config.odin.allowedTypes.indexOf(mime.lookup(extension)) === -1) {
                            return res.badRequest('filetype not allowed');
                        } else {
                            filename = file.filename
                            cb(null, filename);
                        }
                    },
                    dirname: require('path').resolve(sails.config.odin.uploadFolder + '/' + dataset),
                    maxBytes: 2000 * 1000 * 1000
                },
                function onUploadComplete(err, files) {
                    //	IF ERROR Return and send 500 error with error
                    if (err) return res.serverError(err);
                    if (files.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }
                    if (extension == 'text/csv') {
                        converter.fromFile(sails.config.odin.uploadFolder + "/" + dataset + '/' + files[0].filename, function(err, result) {
                            if (err) {
                                res.negotiate(err);
                            }
                            // Retrieve
                            var MongoClient = require('mongodb').MongoClient;

                            // Connect to the db
                            // TODO: Put the mongo URL in config/odin.js, separated (host and port, host NOT including the mongodb:// bit)
                            MongoClient.connect("mongodb://localhost:27017/" + dataset, function(err, db) {
                                if (err) return res.negotiate(err)

                                var collection = db.collection(files[0].filename);

                                collection.insert(result, {
                                    w: 1
                                }, function(err, res) {
                                    if (err) return res.negotiate(err)
                                });
                            });
                        });
                    }
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
            )
        }
    },
    download: function(req, res) {
        const pk = actionUtil.requirePk(req);

        File.findOne(pk).exec(function(err, file) {
            if (err) return res.negotiate(err)

            res.set('Content-Type', mime.lookup(file.name.split('.').pop()));
            res.set('Content-Disposition', 'attachment; filename=' + file.name);
            var dirname = require('path').resolve(sails.config.odin.uploadFolder + '/' + file.dataset + '/' + file.name);
            console.log(dirname);
            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk();
            fileAdapter.read(dirname).on('error', function(err) {
                return res.serverError(err);
            }).pipe(res);
        });
    },
};