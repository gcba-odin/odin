const path = require('path');
const sails = require('sails');

module.exports.odin = {
    baseUrl: 'http://localhost:3000',
    kongHost: 'http://kongexample.com',
    kongAdmin: 'http://kongexample.com:8001',
    recaptchaSecret: '6LcBhAkUAAAAABqD6jm_Cd3uFALNoXRr6ZXqvyBG',
    uploadFolder: 'files',
    datasetZipFolder: 'datasets',

    defaultEncoding: 'utf8',
    dataStorage: {
        host: 'localhost',
        port: '27017'
    },
    logFile: 'sailsApp.log',
    logFolder: 'logs',
    logLevel: 'error',

    statisticsPath: 'stats'
};
