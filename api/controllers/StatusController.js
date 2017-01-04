"use strict";

/**
 * StatusController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var pluralize = require('pluralize')

module.exports = {
    publish: function(req, res) {
        const pk = actionUtil.requirePk(req);
        var model = this.initializeModel(req)
        model.update({
            id: pk
        }, {
            status: sails.config.statuses.published,
            publishedAt: new Date()
        }).then(function(data,err) {
            if (err) return res.negotiate(err)
            return res.updated(data)
        });
    },
    unpublish: function(req, res) {
        const pk = actionUtil.requirePk(req);
        var model = this.initializeModel(req)
        model.update({
            id: pk
        }, {
            status: sails.config.statuses.unpublished,
            unPublishedAt: new Date()
        }).then(function(data,err) {
            console.log('then')
            if (err) return res.negotiate(err)
            return res.updated(data)
        });
    },
    reject: function(req, res) {
        const pk = actionUtil.requirePk(req);
        var model = this.initializeModel(req)
        model.update({
            id: pk
        }, {
            status: sails.config.statuses.rejected,
            rejectedAt: new Date()
        }).then(function(data,err) {
            if (err) return res.negotiate(err)
            return res.updated(data)
        });
    },
    cancel: function(req, res) {
        const pk = actionUtil.requirePk(req);
        var model = this.initializeModel(req)
        model.update({
            id: pk
        }, {
            status: sails.config.statuses.draft,
            cancelledAt: new Date()
        }).then(function(data,err) {
            if (err) return res.negotiate(err)
            return res.updated(data)
        });
    },
    review: function(req, res) {
        const pk = actionUtil.requirePk(req);
        var model = this.initializeModel(req)
        model.update({
            id: pk
        }, {
            status: sails.config.statuses.revision,
            reviewedAt: new Date()
        }).then(function(data,err) {
            if (err) return res.negotiate(err)
            return res.updated(data)
        });
    },
    initializeModel: function(req) {
        var data = actionUtil.parseValues(req);
        var modelName = pluralize(data.model, 1);
        return sails.models[modelName];
    }
};
