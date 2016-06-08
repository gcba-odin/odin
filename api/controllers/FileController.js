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

module.exports = {
    upload: function(req, res) {
        var filename = ''
        var dataset = req.param('dataset');
        if (!shortid.isValid(dataset)) return res.badRequest('Dataset can contain only numbers and letters');
        UploadService.uploadFile(req, res, filename);

        var data = actionUtil.parseValues(req)
        data.url = sails.config.odin.uploadFolder + '/' + dataset + '/' + filename
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

    },
    download: function(req, res) {
        const pk = actionUtil.requirePk(req);
        console.log(pk)
        File.findOne(pk).then(function(file) {
            if (!file) return res.notFound()
            FileType.findOne(file.type).then(function(filetype) {
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
                    fileAdapter.read(dirname).on('error', function(err) {
                        return res.serverError(err);
                    }).pipe(res);
                } else {
                    return res.forbidden();
                }
            }).fail(function(err) {
                console.log(err)
                res.negotiate()
            })
        }).fail(function(err) {
            console.log(err)
            res.negotiate()
        })
    },
};