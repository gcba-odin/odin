"use strict";

/**
 * DeleteController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    delete(req, res) {
        var model = actionUtil.parseModel(req);
        var id = req.param('id');
        model.update({
            id: id
        }, {
            deletedAt: new Date()
        }).exec(function(err, record) {
            if (err) return res.negotiate(err);
            return res.deleted();
        });
    },
    restore(req, res) {
        var model = actionUtil.parseModel(req);
        var id = req.param('id');
        model.update({
            id: id
        }, {
            deletedAt: NULL
        }).exec(function(err, record) {
            if (err) return res.negotiate(err);
            return res.ok();
        });
    }
};