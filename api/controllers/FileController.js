"use strict";

/**
 * FileController
 * @description :: Server-side logic for ...
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const Response = require('../services/ResponseBuilderService');
const mime = require('mime');
const slug = require('slug');
const shortid = require('shortid');
const json2csv = require('json2csv');
const json2xls = require('json2xls');
const _ = require('lodash');
const ipaddr = require('ipaddr.js');

// var dirname = require('path')
var SkipperDisk = require('skipper-disk');

module.exports = {
    // publish: function(req, res) {
    //     const pk = actionUtil.requirePk(req);
    //     return PublishService.publishModel(File, pk, 'publishedStatus', res)
    // },
    unpublish: function(req, res) {
        const pk = actionUtil.requirePk(req);
        return PublishService.publishModel(File, pk, 'unpublished', res)
    },
    reject: function(req, res) {
        const pk = actionUtil.requirePk(req);
        return PublishService.publishModel(File, pk, 'rejected', res)
    },
    create: function(req, res) {
        UploadService.createFile(req, res, true, function(err, data) {
            if (err)
                return res.negotiate(err)
            UploadService.metadataSave(File, data, 'file', req, res);
            this.updateLayout(data);
        }.bind(this));
    },
    update: function(req, res) {
        UploadService.createFile(req, res, false, function(err, data) {
            if (err)
                return res.negotiate(err)
            UploadService.metadataUpdate(File, data, 'file', req, res);
            this.updateLayout(data);
        }.bind(this));
    },
    download: function(req, res) {
        // const pk = actionUtil.requirePk(req);
        var identifier = req.param('identifier');

        var findCriteria = shortid.isValid(identifier)
            ? identifier
            : {
                fileName: identifier
            }
        File.findOne(findCriteria).populate('dataset').then(function(file) {
            if (!file)
                return res.notFound();

            var dirname = sails.config.odin.uploadFolder + "/" + slug(file.dataset.name, {lower: true}) + '/' + file.fileName;

            var fileAdapter = SkipperDisk();

            var extension = file.fileName.split('.').pop();
            res.set('Content-Type', mime.lookup(extension));
            res.set('Content-Disposition', 'attachment; filename=' + file.fileName);

            LogService.winstonLog('verbose', 'file downloaded', {
                ip: req.ip,
                resource: file.id
            });

            var datasetEndpoint = '/datasets/' + file.dataset.id + '/download'

            var ip = req.headers['x-forwarded-for']
                ? req.headers['x-forwarded-for']
                : req.connection.remoteAddress
            ip = _.indexOf(ip, ',') !== -1
                ? ip.split(',')[0]
                : ip;
            var addr = ipaddr.process(ip);
            Statistic.create({method: 'GET', resource: 'Dataset', endpoint: datasetEndpoint, ip: addr.toString(), useragent: req.headers['user-agent']}).exec(function(err, statistic) {
                console.log('dataset statistic created')
            });

            Metric.updateOrCreateMetric(file.dataset.id)

            fileAdapter.read(dirname).on('error', function(err) {
                console.dir(err);
                return res.serverError(err);
            }).pipe(res);
        }).fail(function(err) {
            if (err)
                console.error(err);

            return res.negotiate();
        });
    },
    contents: function(req, res) {
        const pk = actionUtil.requirePk(req);

        File.findOne(pk).then(function(file) {
            if (!file)
                return res.notFound();
            FileType.findOne(file.type).then(function(filetype) {
                if (!filetype)
                    return res.notFound();
                if (filetype.api) {

                    var builder = new Response.ResponseGET(req, res, true);
                    builder.contentsQuery(file.dataset, file.fileName, function(err, data) {
                        if (err)
                            return res.negotiate(err)
                        return res.ok(data, {
                            meta: builder.meta(' '),
                            links: builder.links(' ')
                        });
                    });
                } else {
                    return res.notAcceptable();
                }
            });
        });
    },
    formattedDownload: function(req, res) {
        var identifier = req.param('identifier');
        const values = actionUtil.parseValues(req);

        var findCriteria = shortid.isValid(identifier)
            ? identifier
            : {
                fileName: identifier
            };

        // find the fileid within the parameters
        var format = _.get(values, 'format', '');
        format = mime.lookup(format);
        var extension = mime.extension(format);

        // available downlaod formats are: csv,xls,xlsx
        var availableFormats = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        if (availableFormats.indexOf(format) === -1) {
            return res.badRequest();
        } else {
            File.findOne(findCriteria).populate(['type', 'dataset']).exec(function(err, file) {
                if (err)
                    return res.negotiate(err);
                if (file.type.mimetype.indexOf(format) !== -1) {
                    return this.download(req, res)
                }
                if (!file.type.api) {
                    return res.badRequest();
                }
                var result;
                DataStorageService.mongoContents(file.dataset.id, file.fileName, 0, 0, function(err, data) {
                    if (err) 
                        return res.negotiate(err)
                    _.forEach(data, function(elem) {
                        delete elem._id
                    });

                    LogService.winstonLog('verbose', 'file downloaded', {
                        ip: req.ip,
                        resource: file.id
                    });

                    var slugifiedName = slug(file.name, {lower: true})

                    if (format === 'text/csv') {
                        result = json2csv({data: data});

                        res.set('Content-Type', format);

                        res.set('Content-Disposition', 'attachment; filename=' + slugifiedName + '.' + extension);

                        res.send(result);
                    } else {
                        res.xls(slugifiedName + '.' + extension, data);
                    }

                });

            }.bind(this));
        }

    },
    resources: function(req, res) {
        var resources = {};

        this.findResource('map', req, res).then(function(maps) {
            if (!_.isEmpty(maps))
                resources['maps'] = maps;
            this.findResource('chart', req, res).then(function(charts) {
                if (!_.isEmpty(charts))
                    resources['charts'] = charts;
                return res.ok(resources);
            });
        }.bind(this));
    },
    findResource(model, req, res) {
        const pk = actionUtil.requirePk(req);
        req.options.model = model;
        req.params.where = {
            file: pk
        };
        var builder = new Response.ResponseGET(req, res, true);
        return builder.findQuery();
    },
    updateLayout: function(data) {
        // if the file has the property layout on true,
        // find on the dataset if previous file with that property existed and set it to false
        if (data.layout === true) {
            File.update({
                id: {
                    '!': data.id
                },
                dataset: data.dataset,
                layout: true
            }, {layout: false}).then(function(file) {
                console.log('layout updated');
            })
        }
    }
};
