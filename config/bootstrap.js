"use strict";

/**
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 * @param {Function} cb This function should always be called, so DON'T REMOVE IT
 */
const fs = require('fs');

module.exports = {
  bootstrap: cb => {
    fs.lstat(sails.config.odin.uploadFolder, function(err, stats) {
      if (err || !stats.isDirectory()) {
        fs.mkdirSync(sails.config.odin.uploadFolder);
      }
    })
    cb()
  }
};