"use strict";

/**
 * Production environment settings
 * @description :: This section overrides all other config values ONLY in production environment
 */

module.exports = {
  port: 80,
  log: {
    level: 'info'
  },
  appUrl: 'http://137.135.84.77' + (sails.config.port != 80) ? ':' + sails.config.port : '',
};