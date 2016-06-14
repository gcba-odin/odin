module.exports.odin = {
    uploadFolder: '/home/Admin001/files',
    allowedTypes: ['text/yaml', 'text/csv', 'text/html', 'text/calendar', 'application/pdf', 'application/x-rar-compressed', 'application/rss+xml',
        'application/octet-stream', 'application/vnd.ms-excel', 'application/xml', 'application/zip'
    ],
    defaultEncoding: 'utf8',
    filesDb: {
        host: 'localhost',
        port: '27017'
    },
    logWhitelist: ['category', 'dataset', 'fileType', 'file', 'organization', 'status', 'tag', 'updateFrequency', 'user'],
};