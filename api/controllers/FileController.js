"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const mime = require('mime');

module.exports = {
    upload: function(req, res) {
        UploadService.uploadFile(req, res);
    },
    download: function(req, res) {
        const pk = actionUtil.requirePk(req);

        File.findOne(pk).then(function(file) {
            if (!file) return res.notFound();
            FileType.findOne(file.type).then(function(filetype) {
                if (!filetype) return res.notFound();
                if (filetype.api) {
                    var dirname = require('path').resolve(sails.config.odin.uploadFolder + '/' + file.dataset + '/' + file.name);
                    var SkipperDisk = require('skipper-disk');
                    var fileAdapter = SkipperDisk();

                    res.set('Content-Type', mime.lookup(file.name.split('.').pop()));
                    res.set('Content-Disposition', 'attachment; filename=' + file.name);

                    fileAdapter.read(dirname).on('error', function(err) {
                        return res.serverError(err);
                    }).pipe(res);
                } else {
                    return res.forbidden();
                }
            }).fail(function(err) {
                console.log(err);
                return res.negotiate();
            })
        }).fail(function(err) {
            console.log(err);
            return res.negotiate();
        });

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