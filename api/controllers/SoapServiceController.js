/**
 * SoapServiceController
 *
 * @description :: Server-side logic for managing Soapservices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var slug = require('slug');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    create: function(req, res) {
        var data = actionUtil.parseValues(req);
        // add the url field , as if it was the 'addUrl' policy
        data.file.url = sails.config.odin.baseUrl + '/model/id';
        // add the createdBy field, as if it was the 'addCreatedBy' policy
        data.file.createdBy = req.user;
        // real file name in the filesystem
        data.file.fileName = slug(data.file.name, {
            lower: true
        }) + '.json';

        // json filetype
        data.file.type = '9WRhpRV';
        File.create(data.file).then(function(createdFile) {
            data.file = createdFile;
            SoapService.create(data).then(function(createdService) {

                // Logs
                LogService.log(req, createdService.id);
                LogService.winstonLog('info', SoapService + ' created', {
                    ip: req.ip,
                    resource: createdService.id
                });
                // End Logs

                File.update(createdFile.id, {
                    soapService: createdService
                }).then(function(updatedFile) {
                    updatedFile = updatedFile[0];

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

                    //Run web service sync
                    WebService.syncByFileId(updatedFile.id);

                    //populate the response
                    File.find(updatedFile.id).populate(associations).exec(function(err, record) {
                        if (err) res.negotiate(err);

                        var meta = {
                            code: sails.config.success.CREATED.code,
                            message: sails.config.success.CREATED.message
                        };

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