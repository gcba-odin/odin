"use strict";

/**
 * CategoryController
 * @description :: Server-side logic for ...
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const SkipperDisk = require('skipper-disk');
const _ = require('lodash');

module.exports = {
    create: function(req, res, cb) {
        UploadService.uploadImage(req, res, function(data) {
            UploadService.metadataSave(Category, data, 'category', req, res);
        });
    },
    update: function(req, res) {
        UploadService.uploadImage(req, res, function(data) {
            UploadService.metadataUpdate(Category, data, 'category', req, res);
        });
    },
    image: function(req, res) {
        const pk = actionUtil.requirePk(req);

        Category.findOne(pk).then(function(category) {
            if (!category) return res.notFound();

            var dirname = sails.config.odin.uploadFolder + '/categories/' + category.fileName;
            var fileAdapter = SkipperDisk();
            res.set('Content-Type', 'image/svg+xml');
            res.set('Content-Disposition', 'attachment; filename=' + _.snakeCase(category.name) + '.svg');

            LogService.winstonLog('verbose', 'category image downloaded', {
                ip: req.ip,
                resource: pk
            });

            fileAdapter.read(dirname).on('error', function(err) {
                console.dir(err);
                return res.serverError(err);
            }).pipe(res);
        }).fail(function(err) {
            if (err) console.error(err);

            return res.negotiate();
        });
    }

};
