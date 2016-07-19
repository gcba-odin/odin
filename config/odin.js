const path = require('path');

module.exports.odin = {
    uploadFolder: path.join(process.cwd(), 'files'),
    defaultEncoding: 'utf8',
    dataStorage: {
        host: 'localhost',
        port: '27017'
    },
    allowedTypes: ['text/yaml', 'text/csv', 'text/html', 'text/calendar',
        'application/pdf', 'application/x-rar-compressed', 'application/rss+xml',
        'application/octet-stream', 'application/vnd.ms-excel', 'application/xml',
        'application/zip', 'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    baseUrl: 'http://localhost:3000'
};