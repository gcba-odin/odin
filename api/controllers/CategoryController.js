"use strict";

/**
 * CategoryController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const mime = require('mime');
const shortid = require('shortid');

module.exports = {
    upload: function(req, res) {
        var data = actionUtil.parseValues(req);

        var uploadFile = req.file('uploadFile').on('error', function(err) {
            if (!res.headersSent) return res.negotiate(err);
        });

        uploadFile.upload({
            saveAs: function(file, cb) {
                mimetype = mime.lookup(file.filename.split('.').pop());
                if (mimetype === 'image/svg+xml') {
                    return res.negotiate({
                        status: 415,
                        code: 415,
                        message: 'filetype not allowed'
                    });
                } else {
                    return cb(null, _.snakeCase(data.name) + '.svg');
                }
            },
            dirname: path.resolve(sails.conifig.odin.uploadFolder + '/categories')
        }, function onUploadComplete(err, files) {
            if (err) return res.serverError(err);
            if (files.length === 0) {
                return res.badRequest('No file was uploaded');
            }
            UploadService.metadataSave(Category, data, 'category', req, res);

        });
    }

};