"use strict";

module.exports = {
    // 'PATCH /datasets/:id/publish': {
    //     controller: 'Dataset',
    //     model: 'dataset',
    //     action: 'publish'
    // },
    'PATCH /datasets/:id/unpublish': {
        controller: 'Dataset',
        model: 'dataset',
        action: 'unpublish'
    },
    'GET /datasets/:id/filetypes': {
        controller: 'Dataset',
        model: 'dataset',
        action: 'getFiletypes'
    },
    'GET /datasets/statistics': {
        blueprint: 'statistics',
        model: 'dataset'
    },
    'OPTIONS /datasets/statistics': {
        controller: 'Options',
        model: 'dataset',
        action: 'custom'
    },
    'DELETE /datasets': {
        controller: 'NotImplemented',
        model: 'dataset',
        action: 'notImplemented'
    },
    'PATCH /datasets': {
        controller: 'NotImplemented',
        model: 'dataset',
        action: 'notImplemented'
    },
    'PUT /datasets': {
        controller: 'NotImplemented',
        model: 'dataset',
        action: 'notImplemented'
    },
    'GET /datasets/:id/download': 'Dataset.download',
    'GET /datasets/feed/rss': 'Dataset.feedRss',
    'GET /datasets/first': {
        blueprint: 'first',
        model: 'dataset'
    },
    'GET /datasets/last': {
        blueprint: 'last',
        model: 'dataset'
    },
    'GET /datasets/search': {
        blueprint: 'search',
        model: 'dataset'
    },
    'OPTIONS /datasets/search': {
        controller: 'Options',
        model: 'dataset',
        action: 'custom'
    },
    // 'PATCH /datasets/:id': {
    //     blueprint: 'update',
    //     model: 'dataset',
    //     policy: 'isAuthenticated'
    // },
    'HEAD /datasets/*': {
        controller: 'Head',
        action: 'Head',
        model: 'dataset'
    },
    'HEAD /datasets': {
        controller: 'Head',
        action: 'Head',
        model: 'dataset'
    },
    'OPTIONS /datasets': {
        controller: 'Options',
        model: 'dataset',
        action: 'collection'
    },
    'OPTIONS /datasets/first': {
        controller: 'Options',
        model: 'dataset',
        action: 'query'
    },
    'OPTIONS /datasets/last': {
        controller: 'Options',
        model: 'dataset',
        action: 'query'
    },
    'OPTIONS /datasets/count': {
        controller: 'Options',
        model: 'dataset',
        action: 'count'
    },
    'OPTIONS /datasets/:id': {
        controller: 'Options',
        model: 'dataset',
        action: 'instance'
    }
};
