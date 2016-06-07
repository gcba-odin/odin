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
var Iconv = require('iconv').Iconv;
var Buffer = require('buffer').Buffer;
var toArray = require('stream-to-array');
var toBuffer = require('stream-to-buffer')

module.exports = {
    upload: function (req, res) {
        var extension = '';
        var filename = '';
        var uploadFile = req.file('uploadFile').on('error', function (err) {
            if (!res.headersSent) return res.negotiate(err);
        });
        var dataset = req.param('dataset');
        if (!shortid.isValid(dataset)) return res.badRequest('Dataset can contain only numbers and letters');

        console.log(uploadFile.isNoop);

        if (!uploadFile.isNoop) {

            uploadFile.upload({
                    saveAs: function (file, cb) {
                        //Get the extension of the file
                        extension = mime.lookup(file.filename.split('.').pop());
                        // If the extension is present on the array of allowed types we can save it
                        var iconv = new Iconv('UTF-8', 'ASCII//IGNORE');

                        console.log('inside onProgress');
                        // toBuffer(file, function (err, arr) {
                        //     if (err) console.log(err);
                        //     console.log('1');
                        //     console.log(arr.toString());
                        //     arr = iconv.convert(arr).toString();
                        //
                        // });
                        // toArray(file._readableState.buffer[0], function (err, arr) {
                        //     if (err) console.log(err);
                        //     console.log('2');
                        //     console.log(arr);
                        // });
                        // toArray(file._readableState.buffer, function (err, arr) {
                        //     if (err) console.log(err);
                        //     console.log('3');
                        //     console.log(arr);
                        // });
                        // console.log('outside streamtobuffer');


                        console.log('before convert: ' + file._readableState.buffer[0]);

                        // var a  = iconv.convert(file._readableState.buffer[0]);
                        file._readableState.buffer[0] = iconv.convert(file._readableState.buffer[0]);
                        file.byteCount=file._readableState.buffer[0].length;
                        file._readableState.length=file._readableState.buffer[0].length;
                        
                        console.log('after convert: ' + file._readableState.buffer[0]);

                        if (sails.config.odin.allowedTypes.indexOf(mime.lookup(extension)) === -1) {
                            console.log('filetype not allowed');
                            return res.badRequest('filetype not allowed');
                        } else {
                            filename = file.filename;
                            console.log('before cb');
                            cb(null, file.filename);
                        }
                    },
                    dirname: require('path').resolve(sails.config.odin.uploadFolder + '/' + dataset),
                    maxBytes: 2000 * 1000 * 1000,

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

                    var filePath = sails.config.odin.uploadFolder + "/" + dataset + '/' + filename;
                    // var fs = require("fs");
                    // var input = fs.readFileSync(filePath, {
                    // encoding: "binary"
                    // });
                    // var iconv = new Iconv('UTF-8', 'ASCII//IGNORE');
                    // var iconv = require('iconv-lite');
                    // var output = iconv.convert(input);
                    // fs.writeFileSync(filePath, output);
                    // TODO: Should be inside a promise!!!
                    if (extension == 'text/csv') {
                        converter.fromFile(filePath, function (err, result) {
                            if (err) {
                                res.negotiate(err);
                            }
                            // Retrieve
                            var MongoClient = require('mongodb').MongoClient;

                            // Connect to the db
                            // TODO: Put the mongo URL in config/odin.js, separated (host and port, host NOT including the mongodb:// bit)
                            MongoClient.connect("mongodb://localhost:27017/" + dataset, function (err, db) {
                                if (err) return res.negotiate(err);

                                var collection = db.collection(files[0].filename);

                                collection.insert(result, {
                                    w: 1
                                }, function (err, res) {
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
                                _.map(newInstance, function (instance) {
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
    download: function (req, res) {
        const pk = actionUtil.requirePk(req);
        console.log(pk)
        File.findOne(pk).then(function (file) {
            if (!file) return res.notFound()
            FileType.findOne(file.type).then(function (filetype) {
                if (!filetype) return res.notFound()
                console.log('before filetype.api')
                console.log(filetype.api);
                if (filetype.api) {
                    res.set('Content-Type', mime.lookup(file.name.split('.').pop()));
                    res.set('Content-Disposition', 'attachment; filename=' + file.name);
                    var dirname = require('path').resolve(sails.config.odin.uploadFolder + '/' + file.dataset + '/' + file.name);
                    console.log(dirname);
                    var SkipperDisk = require('skipper-disk');
                    var fileAdapter = SkipperDisk();
                    fileAdapter.read(dirname).on('error', function (err) {
                        return res.serverError(err);
                    }).pipe(res);
                } else {
                    return res.forbidden();
                }
            }).fail(function (err) {
                console.log(err)
                res.negotiate()
            })
        }).fail(function (err) {
            console.log(err)
            res.negotiate()
        })


        // File.findOne(pk).exec(function(err, file) {
        //     if (err) return res.negotiate(err)
        //         // Filetype.findOne(pk)
        //     res.set('Content-Type', mime.lookup(file.name.split('.').pop()));
        //     res.set('Content-Disposition', 'attachment; filename=' + file.name);
        //     var dirname = require('path').resolve(sails.config.odin.uploadFolder + '/' + file.dataset + '/' + file.name);
        //     console.log(dirname);
        //     var SkipperDisk = require('skipper-disk');
        //     var fileAdapter = SkipperDisk();
        //     fileAdapter.read(dirname).on('error', function(err) {
        //         return res.serverError(err);
        //     }).pipe(res);
        // });
    },
};
