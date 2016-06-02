"use strict";

/**
 * DatasetController
 * @description :: Server-side logic for ...
 */

module.exports = {
    download: function(req, res) {
        const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
        const pk = actionUtil.requirePk(req);
        var file_system = require('fs');
        var archiver = require('archiver');
        // var output = file_system.createWriteStream(sails.config.odin.uploadFolder + '/' + pk + '/dataset' + pk + '.zip');
        var archive = archiver('zip');
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename=' + pk + '.zip');


        // output.on('close', function() {
        //     console.log(archive.pointer() + ' total bytes');
        //     console.log('archiver has been finalized and the output file descriptor has closed.');
        // });

        archive.on('error', function(err) {
            throw err;
        });

        var path = sails.config.odin.uploadFolder + '/' + pk

        archive.pipe(res);
        archive.bulk([{
            expand: true,
            cwd: path,
            src: ['**'],
            // dest: pk
        }]);
        archive.finalize();

    }
};