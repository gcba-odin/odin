"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */

module.exports = {

    upload: function (req, res) {
        var uploadFile = req.file('uploadFile');

        var origifile = uploadFile._files[0].stream.filename;

        uploadFile.upload({
            saveAs: origifile,
            dirname: require('path').resolve('~/files')
            // dirname: require('path').resolve(sails.config.appPath + '/assets/csv/to-review')
        }, function onUploadComplete(err, files) {
            console.log(files[0].fd);

            if (err) return res.serverError(err);
            //	IF ERROR Return and send 500 error with error

            res.json({status: 200, file: files});
        });
    },
    download: function (req, res) {
        var file = req.param('filename');
        // var dirname = require('path').resolve(sails.config.appPath + '/assets/csv/to-review/' + file);
        var dirname = require('path').resolve('~/files/' + file);
        var SkipperDisk = require('skipper-disk');
        var fileAdapter = SkipperDisk();
        fileAdapter.read(dirname).on('error', function (err) {
            return res.serverError(err);
        }).pipe(res);
    }
};
