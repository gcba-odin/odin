"use strict";

/**
 * DeleteController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    delete: function (req, res) {
        var model = actionUtil.parseModel(req);
        var id = req.param('id');

        var user;
        _.isUndefined(req.user) ? user = 'noUser' : user = req.user.id;

        model.update({
            id: id
        }, {
            deletedAt: new Date()
        }).exec(function (err, record) {

            if (err) return res.negotiate(err);

            //Create the log record
            var target = model.adapter.identity;

            if (sails.config.odin.logWhitelist.indexOf(target) != -1) {
                Log.create({
                    action: 'delete',
                    target: target,
                    resource: record[0].id,
                    user: user
                }).exec(function created(err, created) {
                    if (err) return res.negotiate(err);
                });
            }
            return res.deleted();
        });
    },
    restore: function (req, res) {
        var model = actionUtil.parseModel(req);
        var id = req.param('id');

        model.update({
            id: id
        }, {
            deletedAt: null
        }).exec(function (err, record) {
            console.log(record);
            if (err) return res.negotiate(err);
            return res.ok();
        });
    }
};
