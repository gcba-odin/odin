"use strict";

module.exports = {
    'PATCH /files/:id/publish': {
        controller: 'File',
        model: 'file',
        action: 'publish'
    },
    'PATCH /files/:id/unpublish': {
        controller: 'File',
        model: 'file',
        action: 'unpublish'
    },
    'PATCH /files/:id/reject': {
        controller: 'File',
        model: 'file',
        action: 'reject'
    },
    'GET /files/statistics': {
        blueprint: 'statistics',
        model: 'file'
    },
    'GET /files/:id/resources': 'File.resources',
    'GET /files/:identifier/download': 'File.download',
    'GET /files/:identifier/download/:format': 'File.formattedDownload',
    'DELETE /files': {
        controller: 'NotImplemented',
        model: 'file',
        action: 'notImplemented'
    },
    'PATCH /files': {
        controller: 'NotImplemented',
        model: 'file',
        action: 'notImplemented'
    },
    'PUT /files': {
        controller: 'NotImplemented',
        model: 'file',
        action: 'notImplemented'
    },
    'POST /files': {
        controller: 'File',
        model: 'file',
        action: 'create'
    },
    'PUT /files/:id': {
        controller: 'File',
        model: 'file',
        action: 'update'
    },
    'GET /files/:id/contents': 'File.contents',
    'GET /files/first': {
        blueprint: 'first',
        model: 'file'
    },
    'GET /files/search': {
        blueprint: 'search',
        model: 'file'
    },
    'GET /files/last': {
        blueprint: 'last',
        model: 'file'
    },
    'HEAD /files/*': {
        controller: 'Head',
        action: 'Head',
        model: 'file'
    },
    'HEAD /files': {
        controller: 'Head',
        action: 'Head',
        model: 'file'
    },
    'OPTIONS /files': {
        controller: 'Options',
        model: 'file',
        action: 'collection'
    },
    'OPTIONS /files/first': {
        controller: 'Options',
        model: 'file',
        action: 'query'
    },
    'OPTIONS /files/last': {
        controller: 'Options',
        model: 'file',
        action: 'query'
    },
    'OPTIONS /files/count': {
        controller: 'Options',
        model: 'file',
        action: 'count'
    },
    'OPTIONS /files/:id': {
        controller: 'Options',
        model: 'file',
        action: 'instance'
    }
};
