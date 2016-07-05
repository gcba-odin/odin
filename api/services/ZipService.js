 const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
 const fs = require('fs');
 var archiver = require('archiver');

 module.exports = {
     createZip: function(pk) {

         const path = sails.config.odin.uploadFolder + '/' + pk;
         const output = fs.createWriteStream(sails.config.odin.uploadFolder + '/' + pk + '/dataset-' + pk + '.zip');

         //check if the folder of the datasets exist, otherwise create it

         fs.lstat(sails.config.odin.uploadFolder + '/' + pk, function(err, stats) {
             var archive = archiver('zip');

             if (err || !stats.isDirectory()) {
                 fs.mkdirSync(sails.config.odin.uploadFolder + '/' + pk);
             }
             output.on('close', function() {
                 // console.log(archive.pointer() + ' total bytes');
                 // console.log('archiver has been finalized and the output file descriptor has closed.');
             });

             archive.on('error', function(err) {
                 console.error('\nerror archive.on ' + err)
                     // if (!res.headersSent) return res.negotiate(err);
             });

             archive.pipe(output);
             archive.directory(
                 path, pk
             );
             archive.finalize();

         });
     }
 };