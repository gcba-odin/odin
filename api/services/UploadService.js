/*
 * This service handles the file uploads.
 * Performs validation and encodes text files with the encoding specified in config/odin.js.
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
const pluralize = require('pluralize');
const slug = require('slug');
const jsonfile = require('jsonfile');
const _ = require('lodash');
const bulkMongo = require('bulk-mongo');

module.exports = {
    createFile: function(req, res, fileRequired, cb) {
        req.setTimeout(15 * 60 * 1000); // 15 minutes

        var uploadedFile = req.file('uploadFile').on('error', function(err) {
            console.dir(err);
            // if (!res.headersSent) return res.negotiate(err);
        });

        // If there is a file
        if (uploadedFile.isNoop && fileRequired) {
            return res.badRequest(null, {
                message: 'No file was uploaded.'
            });
        } else {
            this.uploadFile(req, res, uploadedFile, fileRequired, cb);
        }
    },

    uploadServiceFile: function(file, json, callback) {
        //TODO: Double check if we need https://www.npmjs.com/package/jsonfile
        var extension = 'json';
        file.fileName = slug(file.name, {
            lower: true
        });
        file.fileName += '.' + extension;
        var upath = UploadService.getFilePath(file.dataset, file);
        fs.lstat(upath, function(err, stats) {
            if (!err && stats.isFile()) {
                UploadService.deleteFile(file.dataset.id, file.fileName, {});
            }

            jsonfile.writeFile(upath, json, function(err) {
                if (err) return callback(err, null);
                // Connect to the db
                DataStorageService.mongoSave(file.dataset.id, file.fileName, json, {});

                // Update their visualizations
                file.dataset = file.dataset.id;
                VisualizationsUpdateService.update(file)

                callback(null, file);
            })
        });
    },

    getDatasetPath: function(dataset) {
        return path.resolve(sails.config.odin.uploadFolder +
            '/' + slug(dataset.name, {
                lower: true
            }));
    },

    getFilePath: function(dataset, file) {
        return UploadService.getDatasetPath(dataset) + '/' + file.fileName;
    },

    uploadFile: function(req, res, uploadedFile, fileRequired, cb) {
        var mimetype = '';
        var extension = '';
        var dataset = req.param('dataset');
        var data = actionUtil.parseValues(req);

        // In case that publishedAt or gatheringDate values are 'null'
        // Set it to null, otherwise the ORM will crash
        data.publishedAt = data.publishedAt === 'null' ? null : data.publishedAt
        data.gatheringDate = data.gatheringDate === 'null' ? null : data.gatheringDate
        var allowedTypes;



        if (uploadedFile.isNoop) {
            // If the file metadata was updated but no new file was added
            // update the fileName in case the name changed
            var oldExtension = data.fileName.split('.').pop();
            data.fileName = slug(data.name, {
                lower: true
            });
            data.fileName += '.' + oldExtension;

            // change physical file

            File.find(data.id).populate('dataset').limit(1).then(function(file) {
                file = file[0];
                // in case the fileName changed, rename the physical file
                var hasSameName = file.fileName == data.fileName;
                var isSameDataset = data.dataset === file.dataset.id;

                console.log('has same name = ' + hasSameName)
                console.log('is same dataset = ' + isSameDataset)

                var originalPath = UploadService.getDatasetPath(file.dataset) + "/" + file.fileName;
                console.log('original path = ' + originalPath)
                if (!isSameDataset) {
                    Dataset.find(data.dataset).limit(1).then(function(newDataset) {
                        newDataset = newDataset[0];
                        DataStorageService.mongoReplace(file.dataset.id,
                            newDataset.id, file.fileName, data.fileName, res);

                        var newPath = UploadService.getDatasetPath(newDataset) + "/" + data.fileName;
                        UploadService.changeFileName(originalPath, newPath);
                    });
                } else {
                    if (!hasSameName) {
                        DataStorageService.mongoRename(file.dataset.id, file.fileName, data.fileName, res);
                        var newPath = UploadService.getDatasetPath(file.dataset) + "/" + data.fileName;
                        UploadService.changeFileName(originalPath, newPath);
                    }
                }
            });

            return cb(data);

        } else {
            Dataset.findOne(dataset).then(function(dataset) {

                FileType.find().exec(function(err, filetypes) {
                    if (err) {
                        return res.negotiate(err);
                    }
                    allowedTypes = _.transform(filetypes, function(allowedTypes, filetype) {
                        _.forEach(filetype.mimetype, function(mime) {
                            allowedTypes.push(mime);
                        })
                    }, []);
                    uploadedFile.upload({
                            saveAs: function(file, cb) {
                                data.fileName = slug(data.name, {
                                    lower: true
                                });
                                //Get the mime and the extension of the file
                                mimetype = mime.lookup(file.filename.split('.').pop());
                                extension = file.filename.split('.').pop();
                                data.fileName += '.' + extension;

                                // If the mime is present on the array of allowed types we can save it
                                if (allowedTypes.indexOf(mimetype) === -1) {
                                    return res.negotiate({
                                        status: 415,
                                        code: 415,
                                        message: 'filetype not allowed'
                                    });
                                } else {

                                    //If file exists, deleted it
                                    if (!fileRequired) {
                                        const pk = actionUtil.requirePk(req);
                                        File.findOne(pk).populate('dataset').then(function(file) {
                                            DataStorageService.deleteCollection(file.dataset.id, file.fileName, res);

                                            // if the uploaded name is the same of the one saved on the filesystem
                                            // don't deleted, just overwrite it
                                            if (file.fileName !== data.fileName) {
                                                var upath = UploadService.getFilePath(file.dataset, file);
                                                fs.lstat(upath, function(err, stats) {
                                                    if (!err && stats.isFile()) {
                                                        UploadService.deleteFile(file.dataset.id, file.fileName, res);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    return cb(null, data.fileName);
                                }
                            },
                            dirname: UploadService.getDatasetPath(dataset),
                            maxBytes: 2000000000

                        },
                        function onUploadComplete(err, files) {
                            //  IF ERROR Return and send 500 error with error
                            if (err) {
                                return res.serverError(err);
                            }
                            if (files.length === 0) {
                                return res.badRequest(null, {
                                    message: 'No file was uploaded'
                                });
                            }

                            // Get the id of the filetype based on mime of the file
                            sails.models.filetype.findOne({
                                mimetype: {
                                    contains: mimetype
                                }
                            }).exec(function(err, record) {
                                if (err) {
                                    return res.negotiate(err);
                                }
                                if (!record) {
                                    return res.serverError('Could not find the filetype uploaded: ' + extension);
                                }
                                data.type = record.id;

                                // If the file is consumable via the API
                                if (record.api) {

                                    var filePath = UploadService.getFilePath(dataset, data);
                                    var readStream = fs.createReadStream(filePath);

                                    if (extension === 'xls' || extension === 'xlsx') {
                                        readStream
                                            .pipe(iconv.decodeStream(sails.config.odin.defaultEncoding))
                                            .collect(function(err, result) {
                                                if (err) return res.negotiate(err);

                                                if (sails.config.odin.defaultEncoding === 'utf8') result = '\ufeff' + result;

                                                //Should check which type the file is and convert it .
                                                var json = [];
                                                //Convert XLS to json, store on nosql database
                                                try {
                                                    var workbook = XLSX.readFile(files[0].fd);

                                                    //Join all the worksheets on one json
                                                    json = _.reduce(workbook.SheetNames, function(result, sheetName) {
                                                        var worksheet = workbook.Sheets[sheetName];

                                                        var currentJson = XLSX.utils.sheet_to_json(worksheet);
                                                        result = _.concat(result, currentJson);
                                                        return result;
                                                    }, []);
                                                    DataStorageService.mongoSave(dataset.id, data.fileName, json, res);
                                                } catch (err) {

                                                }
                                                readStream.destroy();
                                                cb(data);
                                            });
                                    } else {
                                        // Convert to JSON
                                        var params = {
                                            constructResult: false,
                                            delimiter: 'auto',
                                            workerNum: 2
                                        };

                                        var converter = new Converter(params, {
                                            objectMode: true,
                                            highWaterMark: 65535
                                        });

                                        DataStorageService.mongoConnect(dataset.id, data.fileName, res, function(db) {
                                            var factory_function = bulkMongo(db);
                                            var bulkWriter = factory_function(data.fileName);

                                            bulkWriter.on('done', () => {
                                                readStream.destroy();
                                                db.close();
                                                if (!fileRequired) {
                                                    VisualizationsUpdateService.update(data)
                                                }
                                                cb(data);
                                            });

                                            readStream
                                                .pipe(iconv.decodeStream(sails.config.odin.defaultEncoding))
                                                .pipe(converter)
                                                .pipe(bulkWriter);
                                        });
                                    }
                                } else {
                                    cb(data);
                                }
                            });
                        });
                });
            });
        }
    },

    uploadImage: function(req, res, cb) {
        var data = actionUtil.parseValues(req);
        var savePath = path.resolve(sails.config.odin.uploadFolder + '/categories');
        var uploadFile = req.file('uploadImage').on('error', function(err) {
            console.dir(err);
        });
        if (!uploadFile.isNoop) {
            data.fileName = slug(data.name, {
                lower: true
            });

            uploadFile.upload({
                saveAs: function(file, cb) {
                    var mimetype = mime.lookup(file.filename.split('.').pop());

                    if (mimetype !== 'image/svg+xml') {
                        return res.negotiate({
                            status: 415,
                            code: 415,
                            message: 'filetype not allowed'
                        });
                    } else {
                        data.fileName += '.svg';
                        return cb(null, data.fileName);
                    }
                },
                dirname: savePath
            }, function onUploadComplete(err, files) {
                if (err) return res.serverError(err);
                if (files.length === 0) {
                    return res.badRequest(null, {
                        message: 'No file was uploaded'
                    });
                }
                cb(data);
            });
        } else {
            return cb(data);
        }
    },

    metadataSave: function(model, data, modelName, req, res, extraRecordsResponse) {
        model.create(data).exec(function created(err, newInstance) {
            if (err) {
                return res.negotiate(err);
            }

            LogService.log(req, newInstance.id);

            // Log to winston
            LogService.winstonLog('info', modelName + ' created', {
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
                    _.map(newInstance, function(instance) {
                        return instance.toJSON();
                    }) :
                    newInstance.toJSON();
                Model.publishCreate(publishData, !req.options.mirror && req);
            }

            var associations = [];

            _.forEach(model.definition, function(value, key) {
                if (value.foreignKey) {
                    associations.push(key);
                }
            });

            model.find(newInstance.id).populate(associations).exec(function(err, record) {
                if (!_.isUndefined(extraRecordsResponse)) {
                    record[0] = _.merge(record[0], extraRecordsResponse);
                }
                if (err) {
                    res.negotiate(err);
                }
                res.created(record[0], {
                    meta: {
                        code: sails.config.success.CREATED.code,
                        message: sails.config.success.CREATED.message
                    },
                    links: {
                        record: sails.config.odin.baseUrl + '/' + pluralize(modelName) + ' /' + newInstance.id,
                        all: sails.config.odin.baseUrl + '/' + pluralize(modelName)
                    }
                });

            });
        });

    },

    metadataUpdate: function(model, data, modelName, req, res, extraRecordsResponse) {
        // Look up the model
        model.update(data.id, data).exec(function updated(err, records) {

            // Differentiate between waterline-originated validation errors
            // and serious underlying issues. Respond with badRequest if a
            // validation error is encountered, w/ validation info.
            if (err) {
                return res.negotiate(err);
            }


            // Because this should only update a single record and update
            // returns an array, just use the first item.  If more than one
            // record was returned, something is amiss.
            if (!records || !records.length || records.length > 1) {
                req._sails.log.warn(
                    util.format('Unexpected output from `%s.update`.', Model.globalId)
                );
            }

            var updatedRecord = records[0];

            // If we have the pubsub hook, use the Model's publish method
            // to notify all subscribers about the update.
            if (req._sails.hooks.pubsub) {
                if (req.isSocket) {
                    model.subscribe(req, records);
                }
                model.publishUpdate(updatedRecord.id, _.cloneDeep(data), !req.options.mirror && req, {
                    previous: _.cloneDeep(matchingRecord.toJSON())
                });
            }

            LogService.log(req, updatedRecord.id);

            LogService.winstonLog('info', modelName + ' updated', {
                ip: req.ip,
                resource: updatedRecord.id
            });

            var associations = [];

            _.forEach(model.definition, function(value, key) {
                if (value.foreignKey) {
                    associations.push(key);
                }
            });
            //populate the response
            model.find(updatedRecord.id).populate(associations).exec(function(err, record) {
                if (err) {
                    return res.negotiate(err);
                }

                //if we have any extraRecords to add to the response,
                // we merge it to the response
                if (!_.isUndefined(extraRecordsResponse)) {
                    record[0] = _.merge(record[0], extraRecordsResponse);
                }
                return res.updated(record[0], {
                    meta: {
                        code: sails.config.success.OK.code,
                        message: sails.config.success.OK.message
                    },
                    links: {
                        all: sails.config.odin.baseUrl + '/' + modelName,
                        record: sails.config.odin.baseUrl + '/' + modelName + '/' + record.id
                    }
                });

            });

        }); // </updated>

    },

    deleteFile: function(datasetId, fileName, res) {
        Dataset.findOne(datasetId).then(function(dataset) {

            var path = sails.config.odin.uploadFolder + '/' + slug(dataset.name, {
                lower: true
            }) + '/' + fileName;

            fs.unlink(path, function() {
                DataStorageService.deleteCollection(dataset.id, fileName, res);
                ZipService.createZip(dataset.id);
            });
        });
    },
    changeFileName: function(originalPath, newPath) {
        fs.rename(originalPath, newPath, function(err) {
            if (err) throw err;
            console.log('File renamed');
        });
    }
};
