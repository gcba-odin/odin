module.exports.odin = {
    baseUrl: 'http://localhost:3000',
    kongHost: '0.0.0.0',
    kongAdmin: '0.0.0.0:8001',
    recaptchaSecret: '6LcBhAkUAAAAABqD6jm_Cd3uFALNoXRr6ZXqvyBG',
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

module.exports.email = {
  service: 'Gmail',
  auth: {user: 'examplemail@gmail.com', pass: 'onepass'},
  alwaysSendTo: 'examplemail@gmail.com',
  testMode: false,
  templateDir: 'api/views'
};
