const path = require('path');
const sails = require('sails');

module.exports.odin = {
    baseUrl: 'http://localhost:3000',
    kongHost: 'http://kongexample.com',

    uploadFolder: 'files',
    defaultEncoding: 'utf8',
    dataStorage: {
        host: 'localhost',
        port: '27017'
    },
    allowedTypes: ['text/yaml', 'text/csv', 'text/html', 'text/calendar',
        'application/pdf', 'application/x-rar-compressed', 'application/rss+xml',
        'application/octet-stream', 'application/vnd.ms-excel', 'application/xml',
        'application/zip', 'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/x-zip-compressed'
    ],

    logPath: path.join('logs', sails.config.environment + '.log'),
    logLevel: 'error',

    statisticsPath: 'stats'
};