module.exports = {
    createZip: function(pk) {
        const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
        const fs = require('fs');
        const path = sails.config.odin.uploadFolder + '/' + pk;
        const output = fs.createWriteStream(sails.config.odin.uploadFolder + '/' + pk + '/dataset-' + pk + '.zip');
        var archiver = require('archiver');

        //check if the folder of the datasets exist, otherwise create it

        fs.lstat(sails.config.odin.uploadFolder + '/' + pk, function(err, stats) {
            var archive = archiver('zip');

            if (err || !stats.isDirectory()) {
                fs.mkdir( sails.config.odin.uploadFolder + '/' + pk, function (err) {
                    if ( err ) console.log( err );

                    archive.pipe(output);
                    archive.directory(
                        path, pk
                    );
                    archive.finalize();
                });
            }

            output.on('close', function() {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
            });

            archive.on('error', function(err) {
                console.log('\nerror archive.on ' + err)
                    // if (!res.headersSent) return res.negotiate(err);
            });
        });
    }
};