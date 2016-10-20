"use strict";

const pluralize = require('pluralize');

module.exports = {
    publishModel: function (model, id, requiredStatus, res) {
        Config.findOne({
            key: requiredStatus
        }).exec(function (err, statusConfig) {
            if (err) return res.negotiate(err);
            if (requiredStatus === 'unpublishedStatus') {
                // associations will return 0,1,2 depending on the model unpublished
                var associations = this.checkAssociations(model);
                // if associations is eq to 2, the unpublished model is a dataset
                // so we need to unpublish the files associated, and theirs visualizations
                if (associations === 2) {
                    this.unpublishFiles(id, statusConfig.value);
                }
                //    if associations is eq to 1, the unpublished model is a a file
                //    we need to unpublish their visualization
                else if (associations === 1) {
                    this.unpublishVisualizations(id, statusConfig.value)
                }
            }
            model.update(id, {
                status: statusConfig.value,
                publishedAt: requiredStatus === 'publishedStatus' ? new Date() : null
            }).exec(function (err, updatedRecord) {
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
        }.bind(this));
    },
    unpublishFiles: function (id, configValue) {
        File.update({dataset: id}, {
            status: configValue,
            publishedAt: null
        }).then(function (files) {
            _.forEach(files, function (file) {
                PublishService.unpublishVisualizations(file.id, configValue)
            });
        });

    },
    unpublishVisualizations(id, configValue){

        _Map.update({file: id}, {
            status: configValue,
            publishedAt: null
        }).then(function (maps) {
            }
        );
        Chart.update({file: id}, {
            status: configValue,
            publishedAt: null
        }).then(function (charts) {
        });
    },

    checkAssociations: function (model) {
        var value;
        switch (model.identity) {
            case 'dataset':
                value = 2;
                break;
            case 'file':
                value = 1;
                break;
            case 'map':
                value = 0;
                break;
            case 'chart':
                value = 0;
                break;
        }
        return value
    }
}
;
