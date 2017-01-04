"use strict";

const pluralize = require('pluralize');

module.exports = {
    publishModel: function(model, id, requiredStatus, res) {
        // associations will return 0,1,2 depending on the model unpublished
        var associations = this.checkAssociations(model);
        // get the status id
        var status = sails.config.statuses[requiredStatus];

        console.dir(sails.config.statuses)
        console.dir(requiredStatus)
        // if associations is eq to 2, the unpublished model is a dataset
        // so we need to unpublish the files associated, and theirs visualizations
        if (associations === 2) {
            if (requiredStatus === 'unpublished') {
                this.unpublishFiles(id, status);
            } else {
                this.rejectFiles(id, status);
            }
        }
        //    if associations is eq to 1, the unpublished model is a a file
        //    we need to unpublish their visualization
        else if (associations === 1) {
            if (requiredStatus === 'unpublished') {
                this.unpublishVisualizations(id, status)
            } else {
                this.rejectVisualizations(id, status);
            }
        }

        var updateValues = {
            status: status
        }

        requiredStatus === 'unpublished' ? updateValues.unPublishedAt = new Date() : updateValues.rejectedAt = new Date();

        model.update(id,
            updateValues
        ).exec(function(err, updatedRecord) {
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
    },
    unpublishFiles: function(id, status) {
        File.update({
            dataset: id
        }, {
            status: status,
            unPublishedAt: new Date()
        }).then(function(files) {
            _.forEach(files, function(file) {
                PublishService.unpublishVisualizations(file.id, status)
            });
        });

    },
    unpublishVisualizations(id, status) {

        _Map.update({
            file: id
        }, {
            status: status,
            unPublishedAt: new Date()
        }).then(function(maps) {});
        Chart.update({
            file: id
        }, {
            status: status,
            unPublishedAt: new Date()
        }).then(function(charts) {});
    },
    rejectFiles: function(id, status) {
        File.update({
            dataset: id
        }, {
            status: status,
            rejectedAt: new Date()
        }).then(function(files) {
            _.forEach(files, function(file) {
                PublishService.rejectVisualizations(file.id, status)
            });
        });

    },

    rejectVisualizations(id, status) {
        _Map.update({
            file: id
        }, {
            status: status,
            rejectedAt: new Date()
        }).then(function(maps) {});
        Chart.update({
            file: id
        }, {
            status: status,
            rejectedAt: new Date()
        }).then(function(charts) {});
    },

    checkAssociations: function(model) {
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
};
