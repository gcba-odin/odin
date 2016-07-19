const path = require('path');

module.exports.odin = {
    uploadFolder: path.join(process.cwd(), 'files'),
    defaultEncoding: 'utf8',
    dataStorage: {
        host: 'localhost',
        port: '27017'
    },
    baseUrl: 'http://localhost:3000'
};