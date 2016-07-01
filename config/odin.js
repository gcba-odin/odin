module.exports.odin = {
    uploadFolder: '/home/Admin001/files',
    allowedTypes: ['text/yaml', 'text/csv', 'text/html', 'text/calendar', 'application/pdf', 'application/x-rar-compressed', 'application/rss+xml',
        'application/octet-stream', 'application/vnd.ms-excel', 'application/xml', 'application/zip', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    defaultEncoding: 'utf8',
    dataStorage: {
        host: 'localhost',
        port: '27017'
    },
    logWhitelist: ['category', 'dataset', 'fileType', 'file', 'organization', 'status', 'tag', 'updateFrequency', 'user'],
};