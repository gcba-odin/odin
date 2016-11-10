const path = require('path');
const sails = require('sails');

module.exports.odin = {
    baseUrl: 'http://localhost:3000',
    kongHost: '0.0.0.0',
    kongAdmin: '0.0.0.0:8001',
    recaptchaSecret: '6LetbAcUAAAAADUH2850T6PNg_d1EXV04Sv48mZP',
    uploadFolder: 'files',
    datasetZipFolder: 'datasets',
    logFolder: 'logs',
    logFile: 'sailsApp.log',
    statisticsPath: 'stats',
    backupFolder: 'backups',

    defaultEncoding: 'utf8',
    dataStorage: {
        host: 'localhost',
        port: '27017'
    },
    logLevel: 'error'

};
