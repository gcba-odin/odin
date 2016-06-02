"use strict";

/**
 * Development environment settings
 * @description :: This section overrides all other config values ONLY in development environment
 */

module.exports = {
  port: 3000,
  log: {
    level: 'silly'
  },
  models: {
    connection: 'postgres'
  },
  appUrl: 'http://137.135.84.77' + (sails.config.port != 80) ? ':' + sails.config.port : '',
};