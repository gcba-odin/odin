"use strict";

/**
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 * @param {Function} cb This function should always be called, so DON'T REMOVE IT
 */
const fs = require('fs');
var winston = require('winston');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = {
  bootstrap: cb => {

    console.dir('Inside bootstrap function');

    // Create the upload folder

    mkdirp(sails.config.odin.uploadFolder, function(err) {
      if (err) console.error(err);
      else console.log('Upload folder created on: ' + sails.config.odin.uploadFolder)
    });

    mkdirp(sails.config.odin.datasetZipFolder, function(err) {
      if (err) console.error(err);
      else console.log('Zip folder created on: ' + sails.config.odin.datasetZipFolder)
    });



    // Create the logs folder
    var logCompletePath = path.join(sails.config.odin.logFolder, sails.config.odin.logFile);

    mkdirp(sails.config.odin.logFolder, function(err) {
      if (err) console.error(err);
      else {
        console.log('Log folder created on: ' + sails.config.odin.logFolder);
        fs.lstat(logCompletePath, function(err, stats) {
          if (err || !stats.isFile()) {
            var fd = fs.openSync(logCompletePath, 'w');
          }
        });
      }
    });


    // create stats folder which will contain the statistics of the site

    mkdirp(sails.config.odin.statisticsPath, function(err) {
      if (err) console.error(err);
      else console.log('Stats path created on: ' + sails.config.odin.statisticsPath)
    });

    // Require and configure Winston with File
    winston.add(winston.transports.File, {
      filename: logCompletePath,
      level: sails.config.odin.logLevel
    });
    winston.remove(winston.transports.Console);

    // log the app has lifted
    sails.on('lifted', function() {
      LogService.winstonLog('info', 'Sails has lifted!');
    
      UpdateFrequency.find(function(err, updateFrequencies){
        //We should run a cron job per update frequency
        updateFrequencies.forEach(function(updateFrequency) {
          try {
            if(updateFrequency.timePattern){
              var CronJob = require('cron').CronJob;
              new CronJob(updateFrequency.timePattern, function() {
                WebService.syncByUpdateFrequency(updateFrequency);
              }, null, true);
            }
          } 
          catch(ex) {
            console.log("cron pattern not valid");
          } 
        });
      });

    });

    cb();
  }
};
