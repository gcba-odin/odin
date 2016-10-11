"use strict";

/**
 * Development environment settings
 * @description :: This section overrides all other config values ONLY in development environment
 */

const sails = require('sails');

module.exports = {
  hookTimeout: 100000,
  port: 3000,
  log: {
    level: 'verbose'
  },
  models: {
    connection: 'postgres'
  },
  appUrl: 'http://127.0.0.1' + (sails.config.port !== 80) ? ':' + sails.config.port : ''
};
