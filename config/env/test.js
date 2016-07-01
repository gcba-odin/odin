"use strict";

/**
 * Test environment settings
 * @description :: This section overrides all other config values ONLY in test environment
 */

module.exports = {
  log: {
    level: 'silent'
  },
  models: {
    connection: 'memory',
    migrate: 'drop'
  },
  policies: {
    '*': true
  },
  hooks: {
    csrf: false,
    grunt: false,
    i18n: false,
    pubsub: false,
    session: false,
    sockets: false,
    views: false
  },
  http: {
    port: 3000
  },
  odin: {
    uploadFolder: '/home/test/files'
  }
  // appUrl: 'http://137.135.84.77' + (sails.config.port !== 80) ? ':' + sails.config.port : '',
};