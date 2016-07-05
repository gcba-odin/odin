/*
 * This service handles the file uploads. Performs validation and encodes text files with the encoding specified in config/odin.js.
 * And, if the file contents can be exposed via the API, inserts them into the non relational database.
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const mime = require('mime');
const Converter = require("csvtojson").Converter;
const iconv = require('iconv-lite');
const XLSX = require('xlsx');
module.exports = {
    uploadFile: function (req, res) {
        var mimetype = '';
        var extension = '';
        var filename = '';
        var uploadFile = req.file('uploadFile').on('error', function (err) {
            if (!res.headersSent) return res.negotiate(err);
        });
        var dataset = req.param('dataset');

        var data = actionUtil.parseValues(req);

        // Check if the dataset ID is valid
        if (!shortid.isValid(dataset)) return res.badRequest('Dataset can contain only numbers and letters');
        // If there is a file

        if (!uploadFile.isNoop) {
            uploadFile.upload({
                    saveAs: function (file, cb) {

                        //Get the mime and the extension of the file

                        mimetype = mime.lookup(file.filename.split('.').pop());
                        extension = file.filename.split('.').pop();
                        // If the mime is present on the array of allowed types we can save it
                        if (sails.config.odin.allowedTypes.indexOf(mimetype) === -1) {
                            return res.negotiate({
                                status: 415,
                                code: 415,
                                message: 'filetype not allowed'
                            });
                        } else {
                            //if name param is not defined, we put the file name as filename.
                            if (_.isUndefined(data.name)) {
                                filename = file.filename;
                                return cb(null, file.filename);
                                //else, we use name param
                            } else {
                                filename = data.name;
                                return cb(null, data.name);

                            }
                        }
                    },
                    dirname: path.resolve(sails.config.odin.uploadFolder + '/' + dataset),
                    maxBytes: 2000000000

                },
                function onUploadComplete(err, files) {
                    //	IF ERROR Return and send 500 error with error

                    if (err) return res.serverError(err);
                    if (files.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }

                    // Get the id of the filetype based on mime of the file
                    sails.models.filetype.findOne({
                        name: extension
                    }).exec(function (err, record) {
                        if (err) return res.negotiate(err);
                        if (!record) {
                            return res.serverError('Could not find the filetype uploaded: ' + extension);
                        }
                        data.type = record.id;
                        // Check if the upload is a textfile (via mimetype)

                        // if (/^text\/\w+$/.test(mimetype)) {
                        var filePath = sails.config.odin.uploadFolder + "/" + dataset + '/' + filename;

                        // Read the file
                        fs.createReadStream(filePath)
                            // Encode it
                            .pipe(iconv.decodeStream(sails.config.odin.defaultEncoding)).collect(function (err, result) {
                            if (err) return res.negotiate(err);
                            if (sails.config.odin.defaultEncoding === 'utf8') result = '\ufeff' + result;

                            // If the file is consumable via the API
                            if (record.api) {


                                //Should check which type the file is and convert it .

                                var json = [];
                                if (extension === 'xls' || extension === 'xlsx') {
                                    //Convert XLS to json, to store on nosql database

                                    var workbook = XLSX.readFile(files[0].fd);

                                    //Join all the worksheets on one json
                                    json = _.reduce(workbook.SheetNames, function (result, sheetName) {
                                        var worksheet = workbook.Sheets[sheetName];

                                        var currentJson = XLSX.utils.sheet_to_json(worksheet);
                                        result = _.concat(result, currentJson);
                                        return result;
                                    }, []);

                                    DataStorageService.mongoSave(dataset, filename, json, res);


                                } else {
                                    // Convert to JSON

                                    var converter = new Converter({
                                        delimiter: 'auto'
                                    });

                                    converter.fromString(result, function (err, json) {
                                        if (err) {
                                            return res.negotiate(err);
                                        }
                                        if (json.length === 0) return res.badRequest("Invalid or empty csv.");

                                        // Connect to the db
                                        DataStorageService.mongoSave(dataset, filename, json, res);
                                    });
                                }
                            }

                            fs.writeFile(filePath, result, function () {
                            });
                        });
                        // }
                        // Save the file metadata to the relational DB
                        sails.models.file.create(data).exec(function created(err, newInstance) {
                            if (err) return res.negotiate(err);

                            // Log to winston
                            LogService.winstonLog('info', 'file created', {
                                ip: req.ip,
                                resource: newInstance.id
                            });

                            if (req._sails.hooks.pubsub) {
                                if (req.isSocket) {
                                    Model.subscribe(req, newInstance);
                                    Model.introduce(newInstance);
                                }

                                // Make sure data is JSON-serializable before publishing
                                var publishData = _.isArray(newInstance) ?
                                    _.map(newInstance, function (instance) {
                                        return instance.toJSON();
                                    }) :
                                    newInstance.toJSON();
                                Model.publishCreate(publishData, !req.options.mirror && req);
                            }

                            // Send JSONP-friendly response if it's supported
                            res.created(newInstance, {
                                meta: {
                                    code: sails.config.success.CREATED.code,
                                    message: sails.config.success.CREATED.message
                                },
                                links: {
                                    record: req.host + ':' + req.port + '/files/' + newInstance.id
                                }
                            });
                        });
                    })
                })
        } else {
            return res.badRequest('No file was uploaded.');
        }
    }
};
