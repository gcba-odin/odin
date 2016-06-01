"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */
var mime = require('mime');
var Converter = require("csvtojson").Converter;
var converter = new Converter({});
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    upload: function(req, res) {
        var extension = '';
        var filename = ''
        var uploadFile = req.file('uploadFile').on('error', function(err) {
            console.log('Errror!!!!!!!!!!');
            return res.negotiate(err);
        });
        var dataset = req.param('dataset');
        if (!/^[A-Za-z0-9]*$/.test(dataset)) return res.badRequest('Dataset can contain only numbers and letters')
        if (!uploadFile.isNoop) {
            uploadFile.upload({
                    saveAs: function(file, cb) {
                        extension = mime.lookup(file.filename.split('.').pop());

                        // if (mime.lookup(extension) != file.headers['content-type']){
                        //     return res.badRequest('mimetye no coincide con header content type')
                        // }
                        if (sails.config.odin.allowedTypes.indexOf(mime.lookup(extension)) === -1) {
                            return res.badRequest('filetype not allowed');
                        } else {
                            filename = file.filename
                            cb(null, filename);
                        }
                    },
                    dirname: require('path').resolve(sails.config.odin.uploadFolder + '/' + dataset)
                },
                function onUploadComplete(err, files) {
                    //	IF ERROR Return and send 500 error with error
                    if (err) return res.serverError(err);
                    if (files.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }
                    if (extension == 'text/csv') {
                        converter.fromFile(sails.config.odin.uploadFolder + "/" + files[0].filename, function(err, result) {
                            if (err) {
                                res.negotiate(err);
                            }
                            console.log(result);
                        });
                    }
                    // converter.on("end_parsed", function (jsonArray) {
                    //     console.log(jsonArray); //here is your result jsonarray
                    // });
                    var data = actionUtil.parseValues(req)
                    data.url = req.host + ':' + req.port + sails.config.odin.uploadFolder + '/' + dataset + '/' + filename;
                    console.log(data);
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
        var file = req.param('filename');
        var dirname = require('path').resolve(sails.config.odin.uploadFolder + '/' + file);
        var SkipperDisk = require('skipper-disk');
        var fileAdapter = SkipperDisk();
        fileAdapter.read(dirname).on('error', function(err) {
            return res.serverError(err);
        }).pipe(res);
    },
    // index: function (req, res, next) {
    //     var fs = require('fs');
    //     var dirname = require('path').resolve(sails.config.odin.uploadFolder);
    //     fs.readdir(dirname, function (err, filenames) {
    //         if (err) {
    //             next(err);
    //         }
    //         // filenames.forEach(function (filename) {
    //         //   fs.readFile(dirname + '/' + filename, 'utf-8', function (err, content) {
    //         //     if (err) {
    //         //       return next(err);
    //         //     }
    //         //     // onFileContent(filename, content);
    //         //   });
    //         // });
    //         return res.ok({files: filenames})
    //     });
    // },

};