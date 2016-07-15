"use strict";

/**
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 * @param {Function} cb This function should always be called, so DON'T REMOVE IT
 */
const fs = require('fs');
var winston = require('winston');

module.exports = {
  bootstrap: cb => {

    // Create the upload folder
    fs.lstat(sails.config.odin.uploadFolder, function(err, stats) {
      if (err || !stats.isDirectory()) {
        fs.mkdirSync(sails.config.odin.uploadFolder);
      }
    });

    // Create the logs folder
    fs.lstat('logs', function(err, stats) {
      if (err || !stats.isDirectory()) {
        fs.mkdirSync('logs');
      }
    });

    var logPath = 'logs/' + sails.config.environment + '.log'

    // create the log file
    fs.lstat(logPath, function(err, stats) {
      if (err || !stats.isFile()) {
        var fd = fs.openSync(logPath, 'w');
      }
    });

    // Require and configure Winston with File
    winston.add(winston.transports.File, {
      filename: 'logs/' + sails.config.environment + '.log',
      level: 'silly'
    });
    winston.remove(winston.transports.Console);

    // log the app has lifted
    sails.on('lifted', function() {
      LogService.winstonLog('info', 'Sails has lifted!');
    });

    cb();
  }
};