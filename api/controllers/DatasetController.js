"use strict";

/**
 * DatasetController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const Response = require('../services/ResponseBuilderService');
const pluralize = require('pluralize');
var RSS = require('rss');
var SkipperDisk = require('skipper-disk');

module.exports = {
    download: function(req, res) {
        const pk = actionUtil.requirePk(req);

        var path = sails.config.odin.uploadFolder + '/' + pk + '/dataset-' + pk + '.zip';
        var fileAdapter = SkipperDisk();

        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename=dataset-' + pk + '.zip');

        fileAdapter.read(path).on('error', function(err) {
            return res.serverError(err);
        }).pipe(res);
    },
    feedRss: function(req, res) {

        var feedOptions = {
            title: 'Datasets',
            description: 'Feed de datasets',
            generator: 'ODIN',
            feed_url: req.host + ':' + req.port + '/datasets'
                // site_url: '',
                // image_url: '',
                // docs: '',
                // managingEditor: '',
                // webMaster: '',
                // copyright: '',
                // categories: '',
                // pubDate: '',
                // ttl: '',
                // hub: '',
                // custom_namespaces: '',
                // custom_elements: '',
        };
        var feed = new RSS(feedOptions);
        var builder = new Response.ResponseGET(req, res, false);

        // const modelName = pluralize(buiilder._model.adapter.identity);

        builder.getDataForFeedQuery().then(function(records) {
            // console.dir(records[0]);
            _.forEach(records, function(record) {

                var itemOption = {
                    title: record.name,
                    description: record.description,
                    url: req.host + ':' + req.port + '/' + builder.modelName + '/' + record.id,
                    // guid: '',
                    // categories: '',
                    // author: '',
                    date: record.createdAt
                        // lat: '',
                        // long: '',
                        // custom_elements: '',
                        // enclosure: '',
                }
                feed.item(itemOption);
            });
            var xml = feed.xml();
            res.set({
                'Content-Type': 'application/rss+xml'
            });
            return res.send(xml);
        });
    }
};