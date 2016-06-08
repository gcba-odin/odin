module.exports = {
    uploadFile: function(req, res, filename) {
        var extension = '';
        var uploadFile = req.file('uploadFile').on('error', function(err) {
            if (!res.headersSent) return res.negotiate(err);
        });
        if (!uploadFile.isNoop) {

            uploadFile.upload({
                    saveAs: function(file, cb) {
                        //Get the extension of the file
                        extension = mime.lookup(file.filename.split('.').pop());

                        // If the extension is present on the array of allowed types we can save it
                        if (sails.config.odin.allowedTypes.indexOf(extension) === -1) {
                            console.log('filetype not allowed');
                            return res.badRequest('filetype not allowed');
                        } else {
                            filename = file.filename;
                            cb(null, file.filename);
                        }
                    },
                    dirname: require('path').resolve(sails.config.odin.uploadFolder + '/' + dataset),
                    maxBytes: 2000 * 1000 * 1000,

                },
                function onUploadComplete(err, files) {
                    //	IF ERROR Return and send 500 error with error
                    if (err) return res.serverError(err);
                    if (files.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }
                    if (/^text\/\w+$/.test(extension)) {

                        var filePath = sails.config.odin.uploadFolder + "/" + dataset + '/' + filename;

                        fs.createReadStream(filePath)
                            .pipe(iconv.decodeStream('utf8')).collect(function(err, result) {
                                if (err) return res.negotiate(err);

                                var withBOM = '\ufeff' + result;

                                if (extension == 'text/csv') {
                                    converter.fromString(result, function(err, json) {
                                        if (err) {
                                            res.negotiate(err);
                                        }
                                        // Retrieve
                                        var MongoClient = require('mongodb').MongoClient;

                                        // Connect to the db
                                        // TODO: Put the mongo URL in config/odin.js, separated (host and port, host NOT including the mongodb:// bit)
                                        MongoClient.connect("mongodb://localhost:27017/" + dataset, function(err, db) {
                                            if (err) return res.negotiate(err);

                                            var collection = db.collection(files[0].filename);

                                            collection.insert(json, {
                                                w: 1
                                            }, function(err, res) {
                                                if (err) return res.negotiate(err)
                                            });
                                        });
                                    });
                                }

                                fs.writeFile(filePath, withBOM, function() {
                                    console.log("Done!!");
                                });
                            });
                    }
                })
        }
    }
}