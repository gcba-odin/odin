"use strict";

/**
 * DeleteController
 * @description :: Server-side logic for ...
 */
const Response = require('../services/ResponseBuilderService');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

var destroy = require('../blueprints/destroy.js');

module.exports = {
    delete: function(req, res) {
        var model = actionUtil.parseModel(req);
        var id = req.param('id');

        var user;
        user = (_.isUndefined(req.user) ? 'noUser' : req.user.id);

        var includes = [];
        _.forEach(model.associations, function(association) {
            if (association.type === 'collection')
                includes.push(association.alias);
        });
        req.params.include = includes.join(",");

        var builder = new Response.ResponseGET(req, res, false);
        builder.findQuery()
            .then(records => {
                if (_.isUndefined(records[0])) return res.notFound(null, {
                    meta: builder.meta(undefined),
                    links: builder.links(undefined)
                });
                else {
                    var returnRecord = records[0];
                    var hardDelete = true;
                    _.forEach(includes, function(include) {
                        var associationValue = returnRecord[include];
                        if (!_.isUndefined(associationValue) && !_.isEmpty(associationValue)) {
                            hardDelete = false;
                        }
                    });

                    if (hardDelete) {
                        //Model relations are not populated: Hard delete (destroy)
                        destroy(req, res);
                    } else {
                        //Existing model relations: Soft delete
                        sails.controllers.delete.softDelete(req, res, model, id);
                    }
                }
            })
            .catch(res.negotiate);
    },
    softDelete: function(req, res, model, id) {
        //Soft delete
        model.update({
            id: id
        }, {
            deletedAt: new Date()
        }).exec(function(err, record) {

            if (err) return res.negotiate(err);

            //Create the log record
            LogService.log(req, undefined, 'delete');

            LogService.winstonLog('info', model.adapter.identity + ' deleted', {
                ip: req.ip,
                resource: record[0].id
            });

            return res.deleted();
        });
    },
    restore: function(req, res) {
        var model = actionUtil.parseModel(req);
        var id = req.param('id');

        model.update({
            id: id
        }, {
            deletedAt: null
        }).exec(function(err, record) {
            if (err) return res.negotiate(err);
            return res.ok();
        });
    },
    deactivate: function(req, res) {
        var model = actionUtil.parseModel(req);
        var id = req.param('id');

        var user;
        user = (_.isUndefined(req.user) ? 'noUser' : req.user.id);

        this.softDelete(req, res, model, id);
    }
};