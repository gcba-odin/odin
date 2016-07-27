const fs = require('fs');
var archiver = require('archiver');
var mkdirp = require('mkdirp');

module.exports = {
    createZip: function(pk) {

        const path = sails.config.odin.uploadFolder + '/' + pk;
        
        mkdirp(path, function(err) {
            if (err) console.error(err)
            else {
                const output = fs.createWriteStream(sails.config.odin.uploadFolder + '/' + pk + '/dataset-' + pk + '.zip');

                console.log('Dataset folder created on: ' + path);
                var archive = archiver('zip');

                output.on('close', function() {
                    // console.log(archive.pointer() + ' total bytes');
                    // console.log('archiver has been finalized and the output file descriptor has closed.');
                });

                archive.on('error', function(err) {
                    console.error('\nerror archive.on ' + err);
                    // if (!res.headersSent) return res.negotiate(err);
                });

                archive.pipe(output);
                archive.directory(
                    path, pk
                );
                archive.finalize();

            }
        });
    }
};
