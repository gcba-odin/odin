"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const Response = require('../services/ResponseBuilderService');
const mime = require('mime');
const slug = require('slug');
var json2csv = require('json2csv');
var json2xls = require('json2xls');

// var dirname = require('path')
var SkipperDisk = require('skipper-disk');

module.exports = {
    create: function(req, res) {
        UploadService.createFile(req, res, true, function(data) {
            UploadService.metadataSave(File, data, 'file', req, res);
        });
        // UploadService.uploadFile(req, res);
    },
    update: function(req, res) {
        UploadService.createFile(req, res, false, function(data) {
            UploadService.metadataUpdate(File, data, 'file', req, res);
        });
    },
    download: function(req, res) {
        const pk = actionUtil.requirePk(req);

        File.findOne(pk).populate('dataset').then(function(file) {
            if (!file) return res.notFound();

            var dirname = sails.config.odin.uploadFolder + "/" + slug(file.dataset.name, {
                lower: true
            }) + '/' + file.fileName;

            var fileAdapter = SkipperDisk();

            var extension = file.fileName.split('.').pop();
            res.set('Content-Type', mime.lookup(extension));
            res.set('Content-Disposition', 'attachment; filename=' + file.fileName);

            LogService.winstonLog('verbose', 'file downloaded', {
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
    },
    contents: function(req, res) {
        const pk = actionUtil.requirePk(req);

        File.findOne(pk).then(function(file) {
            if (!file) return res.notFound();
            FileType.findOne(file.type).then(function(filetype) {
                if (!filetype) return res.notFound();
                if (filetype.api) {

                    var builder = new Response.ResponseGET(req, res, true);
                    builder.contentsQuery(file.dataset, file.fileName, function(data) {

                        return res.ok(data, {
                            meta: builder.meta(' '),
                            links: builder.links(' ')
                        });
                    });
                } else {
                    return res.forbidden();
                }
            });
        });
    },
    formattedDownload: function(req, res) {
        const values = actionUtil.parseValues(req);
        const pk = actionUtil.requirePk(req);

        // find the fileid within the parameters
        var format = _.get(values, 'format', '');
        format = mime.lookup(format);
        var extension = mime.extension(format);

        // available downlaod formats are: csv,xls,xlsx
        var availableFormats = ['text/csv', 'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (availableFormats.indexOf(format) === -1) {
            return res.badRequest();
        } else {
            File.findOne(pk).populate(['type', 'dataset']).exec(function(err, file) {
                if (err) return res.negotiate(err);
                if (file.type.mimetype === format) {
                    this.download(req, res)
                }
                if (!file.type.api) {
                    return res.badRequest();
                }
                var result;
                FileContentsService.mongoContents(file.dataset.id, file.fileName, 0, 0, res, function(data) {
                    _.forEach(data, function(elem) {
                        delete elem._id
                    });

                    LogService.winstonLog('verbose', 'file downloaded', {
                        ip: req.ip,
                        resource: pk
                    });


                    if (format === 'text/csv') {
                        result = json2csv({
                            data: data
                        });

                        res.set('Content-Type', format);

                        res.set('Content-Disposition', 'attachment; filename=' + file.name + '.' + extension);

                        res.send(result);
                    } else {
                        res.xls(file.name + '.' + extension, data);
                    }

                });

            }.bind(this));
        }

    },
    resources: function(req, res) {
        var resources = {};
        const pk = actionUtil.requirePk(req);

        this.findResource(_Map, pk)
            .then(function(maps) {
                if (!_.isEmpty(maps))
                    resources['maps'] = maps;
                this.findResource(View, pk)
                    .then(function(views) {
                        if (!_.isEmpty(views))
                            resources['views'] = views;
                        this.findResource(Chart, pk)
                            .then(function(charts) {
                                if (!_.isEmpty(charts))
                                    resources['charts'] = charts;
                                return res.ok(resources);
                            });
                    }.bind(this));
            }.bind(this));
    },
    findResource(model, filePk) {
        return model.find({
            file: filePk
        });
    }
};