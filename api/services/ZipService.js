module.exports = {
    createZip: function (pk) {

        console.log('inside create Zip');
        const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
        var file_system = require('fs');
        var archiver = require('archiver');
        const fs = require('fs');

        //check if the folder of the datasets exist, otherwise create it
        fs.lstat(sails.config.odin.uploadFolder + '/' + pk, function (err, stats) {
            console.log('\nis directory? ' + stats.isDirectory());
            console.log('\n eerror: ' + err);

            if (err || !stats.isDirectory()) {
                fs.mkdirSync(sails.config.odin.uploadFolder + '/' + values.id);
            }
            var output = file_system.createWriteStream(sails.config.odin.uploadFolder + '/' + pk + '/dataset-' + pk + '.zip');

            var archive = archiver('zip');

            output.on('close', function () {
                console.log('inside Close Function');
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
            });

            archive.on('error', function (err) {
                // return res.negotiate(err);
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
