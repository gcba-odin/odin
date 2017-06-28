/*
 * This service handles the file uploads.
 * Performs validation and encodes text files with the encoding specified in config/odin.js.
 * And, if the file contents can be exposed via the API, inserts them into the non relational database.
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const Converter = require("csvtojson").Converter;
const iconv = require('iconv-lite');
const XLSX = require('xlsx');
const pluralize = require('pluralize');
const slug = require('slug');
const jsonfile = require('jsonfile');
const _ = require('lodash');
const bulkMongo = require('bulk-mongo');
var Promise = require('bluebird');

module.exports = {
    createFile: (req, fileRequired, cb) => {
        // Set timeout to 15 minutes to let files convert to json and be uploaded
        req.setTimeout(15 * 60 * 1000);

        var uploadedFile = req.file('uploadFile').on('error', (err) => {
            console.log(err);
        });
        if (uploadedFile.isNoop && fileRequired) {
            var err = {
                message: 'No file was uploaded'
            }
            return cb(err);
        } else {
            // a file was uploaded or is not required
            UploadService.uploadFile(req, uploadedFile, fileRequired, cb);
        }
    },

    uploadFile: function(req, uploadedFile, fileRequired, cb) {
        let data = actionUtil.parseValues(req);
        // Clean null on dates, else the ORM will crash
        data = UploadService.cleanDates(data)

        // if we are updating a file find the original
        if (!fileRequired) {
            let fileId = actionUtil.requirePk(req)
            File.findOne(fileId).populate('dataset').populate('type').then(function(file) {
                // if the dataset has changed, find the new one
                if (file.dataset !== data.dataset) {
                    Dataset.findOne(data.dataset).then(function(dataset) {
                        UploadService.updateFile(uploadedFile, data, file, dataset, fileRequired, req, cb)
                    });
                } else {
                    var dataset = file.dataset
                    UploadService.updateFile(uploadedFile, data, file, dataset, fileRequired, req, cb)
                }
            });
        } else {
            // if is a new file, find the associated dataset and proceed with the upload
            Dataset.findOne(data.dataset).then(function(dataset) {
                UploadService.uploadAndParseFile(uploadedFile, data, dataset, fileRequired, req, cb)
            });
        }

    },

    updateFile: (uploadedFile, data, file, newDataset, fileRequired, req, cb) => {
        if (uploadedFile.isNoop) {
            // If the file metadata was updated but no new file was added
            // update the fileName in case the name changed
            var oldExtension = data.fileName.split('.').pop();
            data.fileName = slug(data.name, {lower: true});
            data.fileName += '.' + oldExtension;

            // change physical file and mongo collection
            UploadService.changeMongoAndPhysicalFile(data, file, newDataset, cb)
            return cb(null, data);
        } else {
            DataStorageService.deleteCollection(file.dataset.id, file.fileName, (err) => cb(err));
            // if the uploaded name is the same of the one saved on the filesystem
            // don't deleted, just overwrite it
            if (file.fileName !== data.fileName) {
                var upath = UploadService.getFilePath(file.dataset, file);
                fs.lstat(upath, function(err, stats) {
                    if (!err && stats.isFile()) {
                        UploadService.deleteFile(file.dataset, file.fileName, cb);
                    }
                });
            }
            UploadService.uploadAndParseFile(uploadedFile, data, newDataset, fileRequired, req, cb)
        }
    },

    uploadAndParseFile: (uploadedFile, data, newDataset, fileRequired, req, cb) => {
        var mimetype;
        var extension;
        FileType.find({
            select: ['mimetype', 'api', 'id']
        }).then(filetypes => {
            // Create an object for each allowed filetype
            let allowedTypes = _.transform(filetypes, function(allowedTypes, filetype) {
                _.forEach(filetype.mimetype, function(mime) {
                    allowedTypes[mime] = {
                        api: filetype.api,
                        id: filetype.id
                    }
                })
            }, {});

            // Physically upload the file
            uploadedFile.upload({
                saveAs: function(uploadedFile, saveCb) {
                    data.fileName = slug(data.name, {lower: true});
                    //Get the mime and the extension of the file
                    extension = uploadedFile.filename.split('.').pop();
                    mimetype = mime.lookup(extension);
                    data.fileName += '.' + extension;

                    // If the mime is present on the array of allowed types we can save it
                    if (_.isUndefined(allowedTypes[mimetype])) {
                        let err = {
                            status: 415,
                            code: 415,
                            message: 'filetype not allowed'
                        }
                        return cb(err);
                    }
                    return saveCb(null, data.fileName);

                },
                dirname: UploadService.getDatasetPath(newDataset),
                maxBytes: 4000000000
            }, function onUploadComplete(err, files) {
                if (err) {
                    return cb(err);
                }
                if (files.length === 0) {
                    var err = {
                        status: 400,
                        code: 400,
                        meessage: 'No file was uploaded'
                    }
                    return cb(err);
                }

                // Get the file mimetype and if it's available to parse to non-relational db
                var currentMimetype = allowedTypes[mimetype]
                data.type = currentMimetype.id

                // If the file is consumable via the API
                // TODO: check if file is priority; else save it to the file job queue
                if (currentMimetype.api) {
                    var filePath = UploadService.getFilePath(newDataset, data);
                    var readStream = fs.createReadStream(filePath);

                    // TODO: add json support
                    if (extension === 'xls' || extension === 'xlsx') {
                        files = files[0].fd
                        UploadService.xlsToJson(data, readStream, files, cb)
                    } else {
                        UploadService.csvToJson(newDataset.id, data, readStream, cb)
                    }
                    if (!fileRequired) {
                        VisualizationsUpdateService.update(data)
                    }
                } else {
                    return cb(null, data);
                }
            });
        }).catch(err => cb(err));
    },

    // TODO: remove res parameter, to be available to do it, refactor on DataStorageService should be done
    xlsToJson: function(data, readStream, files, cb) {
        readStream.pipe(iconv.decodeStream(sails.config.odin.defaultEncoding)).collect((err, result) => {
            if (err)
                return cb(err);
            if (sails.config.odin.defaultEncoding === 'utf8')
                result = '\ufeff' + result;

            //Convert XLS to json, store on nosql database
            try {
                var workbook = XLSX.readFile(files);
                //Join all the worksheets on one json
                var json = _.reduce(workbook.SheetNames, function(result, sheetName) {
                    var worksheet = workbook.Sheets[sheetName];

                    var currentJson = XLSX.utils.sheet_to_json(worksheet);
                    result = _.concat(result, currentJson);
                    return result;
                }, []);
                DataStorageService.mongoSave(data.dataset, data.fileName, json, (err) => cb(err));
            } catch (err) {
                return cb(err)
            }
            readStream.destroy();
            return cb(null, data);
        });
    },

    // TODO: remove res parameter and work with cb
    csvToJson: function(dataset, data, readStream, cb) {
        var params = {
            constructResult: false,
            delimiter: 'auto',
            workerNum: 2
        };

        var converter = new Converter(params, {
            objectMode: true,
            highWaterMark: 65535
        });

        DataStorageService.mongoConnect(dataset, data.fileName, function(err, db) {
            if (err)
                return cb(err)
            var factory_function = bulkMongo(db);
            var bulkWriter = factory_function(data.fileName);

            bulkWriter.on('done', () => {
                readStream.destroy();
                db.close();
                cb(null, data);
            });

            readStream.pipe(iconv.decodeStream(sails.config.odin.defaultEncoding)).pipe(converter).pipe(bulkWriter);
        });
    },

    uploadImage: function(req, res, cb) {
        var data = actionUtil.parseValues(req);
        var savePath = path.resolve(sails.config.odin.uploadFolder + '/categories');
        var uploadFile = req.file('uploadImage').on('error', function(err) {});
        if (!uploadFile.isNoop) {
            data.fileName = slug(data.name, {lower: true});

            uploadFile.upload({
                saveAs: function(file, cb) {
                    var mimetype = mime.lookup(file.filename.split('.').pop());

                    if (mimetype !== 'image/svg+xml') {
                        return res.negotiate({status: 415, code: 415, message: 'filetype not allowed'});
                    } else {
                        data.fileName += '.svg';
                        return cb(null, data.fileName);
                    }
                },
                dirname: savePath
            }, function onUploadComplete(err, files) {
                if (err)
                    return res.serverError(err);
                if (files.length === 0) {
                    return res.badRequest(null, {message: 'No file was uploaded'});
                }
                cb(data);
            });
        } else {
            if (data.deleteImage === 'true') {
                UploadService.deleteImage(data.fileName);
                data.fileName = null;
            }
            return cb(data);
        }
    },

    changeMongoAndPhysicalFile: function(data, file, newDataset, cb) {
        // in case the fileName changed, rename the physical file
        var hasSameName = file.fileName == data.fileName;
        var isSameDataset = data.dataset === file.dataset.id;

        var originalPath = UploadService.getDatasetPath(file.dataset) + "/" + file.fileName;
        if (!isSameDataset) {
            // if the file changed of dataset, finde the new one
            if (file.type.api === 'true') {
                DataStorageService.mongoReplace(file.dataset.id, newDataset.id, file.fileName, data.fileName, (err) => cb(err));
            }
            var newPath = UploadService.getDatasetPath(newDataset) + "/" + data.fileName;
            UploadService.changeFileName(originalPath, newPath);
        } else {
            if (!hasSameName) {
                DataStorageService.mongoRename(file.dataset.id, file.fileName, data.fileName, (err) => cb(err));
                var newPath = UploadService.getDatasetPath(file.dataset) + "/" + data.fileName;
                UploadService.changeFileName(originalPath, newPath);
            }
        }
    },

    uploadServiceFile: (file, json, callback) => {
        //TODO: Double check if we need https://www.npmjs.com/package/jsonfile
        var extension = 'json';
        file.fileName = slug(file.name, {lower: true});
        file.fileName += '.' + extension;
        var upath = UploadService.getFilePath(file.dataset, file);
        fs.lstat(upath, function(err, stats) {
            if (!err && stats.isFile()) {
                UploadService.deleteFile(file.dataset, file.fileName, {});
            }

            jsonfile.writeFile(upath, json, function(err) {
                if (err)
                    return callback(err, null);

                // Connect to the db
                DataStorageService.mongoSave(file.dataset.id, file.fileName, json, (err) => callback(err, null));

                // Update their visualizations
                file.dataset = file.dataset.id;
                VisualizationsUpdateService.update(file)

                callback(null, file);
            })
        });
    },

    getDatasetPath: function(dataset) {
        dataset = _.isObject(dataset)
            ? dataset.name
            : dataset
        return path.resolve(sails.config.odin.uploadFolder + '/' + slug(dataset, {lower: true}));
    },

    getFilePath: function(dataset, file) {
        return UploadService.getDatasetPath(dataset) + '/' + file.fileName;
    },

    // TODO: To be removed
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
                var publishData = _.isArray(newInstance)
                    ? _.map(newInstance, function(instance) {
                        return instance.toJSON();
                    })
                    : newInstance.toJSON();
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

    // TODO: To be removed
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
                req._sails.log.warn(util.format('Unexpected output from `%s.update`.', Model.globalId));
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

    deleteFile: function(dataset, fileName, cb) {
        Promise.try(() => {
            if (_.isString(dataset)) {
                return Dataset.findOne(dataset).then((dataset) => dataset)
            }
            return dataset
        }).then((dataset) => {
            var path = sails.config.odin.uploadFolder + '/' + slug(dataset.name, {lower: true}) + '/' + fileName;

            fs.unlink(path, function() {
                DataStorageService.deleteCollection(dataset.id, fileName, (err) => cb(err));
                ZipService.createZip(dataset.id);
            });
        })
    },

    deleteImage: function(fileName) {
        var categoryPath = path.resolve(sails.config.odin.uploadFolder + '/categories/' + fileName);
        fs.unlink(categoryPath, function(err) {
            console.log(err)
            console.log('Category image deleted');
        })
    },

    changeFileName: function(originalPath, newPath) {
        fs.rename(originalPath, newPath, function(err) {
            if (err)
                throw err;
            console.log('File renamed');
        });
    },

    cleanDates: (data) => {
        // In case that publishedAt or gatheringDate values are 'null'
        // Set it to null, otherwise the ORM will crash
        data.publishedAt = data.publishedAt === 'null'
            ? null
            : data.publishedAt
        data.gatheringDate = data.gatheringDate === 'null'
            ? null
            : data.gatheringDate
        data.cancelledAt = data.cancelledAt === 'null'
            ? null
            : data.cancelledAt
        return data
    }
};
