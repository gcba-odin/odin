/**
 * RestServiceController
 *
 * @description :: Server-side logic for managing Restservices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var slug = require('slug');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    create: function(req, res) {
        var data = actionUtil.parseValues(req);
        data.file.url = sails.config.odin.baseUrl + '/model/id';
        data.file.createdBy = req.user
        data.file.fileName = slug(data.file.name, {
            lower: true
        }) + '.json';
        File.create(data.file).then(function(createdFile) {
            console.dir(createdFile)
            data.file = createdFile
            RestService.create(data).then(function(createdService) {

                // Logs
                LogService.log(req, createdService.id);
                LogService.winstonLog('info', RestService + ' created', {
                    ip: req.ip,
                    resource: createdService.id
                });
                // End Logs

                File.update(createdFile.id, {
                    restService: createdService
                }).then(function(updatedFile) {

                    // Logs
                    LogService.log(req, updatedFile.id);
                    LogService.winstonLog('info', File + ' created', {
                        ip: req.ip,
                        resource: updatedFile.id
                    });
                    // End Logs

                    var associations = [];

                    _.forEach(File.definition, function(value, key) {
                        if (value.foreignKey) {
                            associations.push(key);
                        }
                    });
                    //populate the response

                    File.find(updatedFile.id).populate(associations).exec(function(err, record) {
                        if (err) res.negotiate(err);

                        var meta = {
                            code: sails.config.success.CREATED.code,
                            message: sails.config.success.CREATED.message
                        }

                        var links = {
                            record: sails.config.odin.baseUrl + '/files/' + record[0].id,
                            all: sails.config.odin.baseUrl + '/files'
                        };
                        return res.created(record[0], {
                            meta: meta,
                            links: links
                        });

                    });
                })
            });
        })
    }
};