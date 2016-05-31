"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */

module.exports = {

    upload: function (req, res) {

        var uploadFile = req.file('uploadFile').on('error', function (err) {
            console.log('Errror!!!!!!!!!!');
            return res.negotiate(err);
        });
        
        uploadFile.upload({
            saveAs: uploadFile._files[0].stream.filename,
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
    },
    download: function (req, res) {
        var file = req.param('filename');
        // var dirname = require('path').resolve('/home/Admin001/files/' + file);
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
        var dirname = require('path').resolve('/home/lothorien/files/');
        var files = {};
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
    }
    ,

}
;
