"use strict";

/**
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 * @param {Function} cb This function should always be called, so DON'T REMOVE IT
 */
const fs = require('fs');
var winston = require('winston');
var path = require('path')

module.exports = {
  bootstrap: cb => {

    // Create the upload folder
    fs.lstat(sails.config.odin.uploadFolder, function(err, stats) {
      if (err || !stats.isDirectory()) {
        fs.mkdirSync(sails.config.odin.uploadFolder);
      }
    });

    var logCompletePath = path.join(sails.config.odin.logFolder, sails.config.odin.logFile);

    // Create the logs folder
    fs.lstat(sails.config.odin.logFolder, function(err, stats) {
      if (err || !stats.isDirectory()) {
        fs.mkdirSync('logs');
        // create the log file

        fs.lstat(logCompletePath, function(err, stats) {
          if (err || !stats.isFile()) {
            var fd = fs.openSync(logCompletePath, 'w');
          }
        });
      }
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
    });

    cb();
  }
};