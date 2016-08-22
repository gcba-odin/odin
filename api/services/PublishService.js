"use strict";

const pluralize = require('pluralize');

module.exports = {
    publishModel: function(model, id, requiredStatus, res) {
        Config.findOne({
            key: requiredStatus
        }).exec(function(err, statusConfig) {
            if (err) return res.negotiate(err)
            model.update(id, {
                status: statusConfig.value,
                publishedAt: requiredStatus === 'publishedStatus' ? new Date() : null
            }).exec(function(err, updatedRecord) {
                if (err) return res.negotiate(err);
                var modelName = pluralize(model.adapter.identity);
                var meta = {
                    code: sails.config.success.OK.code,
                    message: sails.config.success.OK.message
                };
                var links = {
                    all: sails.config.odin.baseUrl + '/' + modelName,
                    record: sails.config.odin.baseUrl + '/' + modelName + '/' + updatedRecord.id
                };
                return res.ok(updatedRecord, {
                    meta: meta,
                    links: links
                });
            });
        });
    }
}