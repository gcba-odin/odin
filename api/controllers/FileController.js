"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */
var mime = require('mime');

module.exports = {

    upload: function (req, res) {
        var uploadFile = req.file('uploadFile').on('error', function (err) {
            console.log('Errror!!!!!!!!!!');
            return res.negotiate(err);
        });
        if (!uploadFile.isNoop) {
            uploadFile.upload({
                saveAs: function (file, cb) {
                    var extension = file.filename.split('.').pop();
                    console.log(mime.lookup(extension));
                    // if (mime.lookup(extension) != file.headers['content-type']){
                    //     return res.badRequest('mimetye no coincide con header content type')
                    // }
                    if (sails.config.odin.allowedTypes.indexOf(mime.lookup(extension)) === -1) {
                        return res.badRequest('filetype not allowed');
                    }
                    else {
                        cb(null, file.filename);
                    }
                },
                dirname: require('path').resolve(sails.config.odin.uploadFolder)
            }, function onUploadComplete(err, files) {
                //	IF ERROR Return and send 500 error with error
                if (err) return res.serverError(err);
                if (files.length === 0) {
                    return res.badRequest('No file was uploaded');
                }
                res.json({
                    status: 200
                });
            })
        }
    },
    download: function (req, res) {
        var file = req.param('filename');
        var dirname = require('path').resolve(sails.config.odin.uploadFolder + '/' + file);
        var SkipperDisk = require('skipper-disk');
        var fileAdapter = SkipperDisk();
        fileAdapter.read(dirname).on('error', function (err) {
            return res.serverError(err);
        }).pipe(res);
    }
    ,
    index: function (req, res, next) {
        var fs = require('fs');
        var dirname = require('path').resolve(sails.config.odin.uploadFolder);
        fs.readdir(dirname, function (err, filenames) {
            if (err) {
                next(err);
            }
            // filenames.forEach(function (filename) {
            //   fs.readFile(dirname + '/' + filename, 'utf-8', function (err, content) {
            //     if (err) {
            //       return next(err);
            //     }
            //     // onFileContent(filename, content);
            //   });
            // });
            return res.ok({files: filenames})
        });
    },

};
