module.exports = {
    createZip: function(pk) {

        console.log('inside create Zip');
        const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
        var archiver = require('archiver');
        const fs = require('fs');

        //check if the folder of the datasets exist, otherwise create it
        console.log('before fslstat')

        fs.lstat(sails.config.odin.uploadFolder + '/' + pk, function(err, stats) {
            console.log('inside fs.lstat')
            console.log('\nerror lstat' + err)

            if (err || !stats.isDirectory()) {
                fs.mkdirSync(sails.config.odin.uploadFolder + '/' + pk);
            }
            var output = fs.createWriteStream(sails.config.odin.uploadFolder + '/' + pk + '/dataset-' + pk + '.zip');

            var archive = archiver('zip');

            output.on('close', function() {
                console.log('inside Close Function');
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
            });

            archive.on('error', function(err) {
                console.log('\nerror archive.on' + err)
                    // if (!res.headersSent) return res.negotiate(err);
            });

            archive.pipe(output);
            var path = sails.config.odin.uploadFolder + '/' + pk;

            archive.directory(
                path, pk
            );
            archive.finalize();
        });
    }
};