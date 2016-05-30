"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */

module.exports = {

    upload: function (req, res) {
        console.log(req.file('uploadFile'));
        var uploadFile = req.file('uploadFile');

        var origifile = uploadFile._files[0].stream.filename;

        console.log('error');
        console.log('error');
        console.log('error');
        console.log('error');

        uploadFile.upload({
            saveAs: origifile,
            // dirname: require('path').resolve(sails.config.appPath + '/files')
            dirname: require('path').resolve('/home/Admin001/odin/files')
        }, function onUploadComplete(err, files) {
            if (err) return res.serverError(err);
            //	IF ERROR Return and send 500 error with error

            res.json({status: 200});
        });
    },
    download: function (req, res) {
        var file = req.param('filename');
        var dirname = require('path').resolve('/home/Admin001/odin/files/' + file);
        // var dirname = require('path').resolve(sails.config.appPath + '/files/' + file);
        var SkipperDisk = require('skipper-disk');
        var fileAdapter = SkipperDisk();
        fileAdapter.read(dirname).on('error', function (err) {
            return res.serverError(err);
        }).pipe(res);
    }
};
