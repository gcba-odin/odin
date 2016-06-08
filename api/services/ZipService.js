module.exports = {
    createZip: function(pk) {
        console.log('inside create Zip')
        const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
        var file_system = require('fs');
        var archiver = require('archiver');

        var output = file_system.createWriteStream(sails.config.odin.uploadFolder + '/' + pk + '/dataset-' + pk + '.zip');

        var archive = archiver('zip');

        output.on('close', function() {
            console.log('inside Close Function');
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        })

        archive.on('error', function(err) {
            console.log('inside error')
            console.log(err)
                // return res.negotiate(err);
        });

        archive.pipe(output);
        var path = sails.config.odin.uploadFolder + '/' + pk;

        //try path,path (?)
        archive.directory(
            path, pk
        );
        archive.finalize();
    }
}