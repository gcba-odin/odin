const fs = require('fs');
var archiver = require('archiver');
var mkdirp = require('mkdirp');
var slug = require('slug');

module.exports = {
    createZip: function (pk) {
        Dataset.findOne(pk).then(function (dataset) {

            const path = sails.config.odin.uploadFolder + '/' + slug(dataset.name, {lower: true});

            mkdirp(path, function (err) {

                mkdirp(sails.config.odin.datasetZipFolder, function (err) {
                    if (err) console.error(err);
                    else {
                        const output = fs.createWriteStream(sails.config.odin.datasetZipFolder + '/' + slug(dataset.name, {lower: true}) + '.zip');

                        console.log('Dataset folder: ' + path);
                        var archive = archiver('zip');

                        output.on('close', function () {
                            // console.log(archive.pointer() + ' total bytes');
                            // console.log('archiver has been finalized and the output file descriptor has closed.');
                        });

                        archive.on('error', function (err) {
                            console.error('\nerror archive.on ' + err);
                            // if (!res.headersSent) return res.negotiate(err);
                        });

                        archive.pipe(output);
                        archive.directory(
                            path, slug(dataset.name, {lower: true})
                        );
                        archive.finalize();

                    }
                });
            });
        });

    }
};
