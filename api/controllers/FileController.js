"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */

module.exports = {

    upload: function (req, res) {
        var uploadFile = req.file('uploadFile');
        if (uploadFile.isNoop) {
            return res.badRequest('Uploaded File is Noop. No file was uploaded');
        }

        var origifile = uploadFile._files[0].stream.filename;
        uploadFile.upload({
            saveAs: origifile,
            dirname: require('path').resolve('/home/Admin001/files')
        }, function onUploadComplete(err, files) {
            //	IF ERROR Return and send 500 error with error
            if (err) return res.serverError(err);
            if (files.length === 0) {
                return res.badRequest('No file was uploaded');
            }
            res.json({status: 200});
        });
    },
    download: function (req, res) {
        var file = req.param('filename');
        var dirname = require('path').resolve('/home/Admin001/files/' + file);
        var SkipperDisk = require('skipper-disk');
        var fileAdapter = SkipperDisk();
        fileAdapter.read(dirname).on('error', function (err) {
            return res.serverError(err);
        }).pipe(res);
    }
};
