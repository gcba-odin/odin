"use strict";

module.exports = {
    // 'PATCH /charts/:id/publish': {
    //     controller: 'Chart',
    //     model: 'chart',
    //     action: 'publish'
    // },
    'PATCH /charts/:id/unpublish': {
        controller: 'Chart',
        model: 'chart',
        action: 'unpublish'
    },
    'PATCH /charts/:id/reject': {
        controller: 'Chart',
        model: 'chart',
        action: 'reject'
    },
    'GET /charts/statistics': {
        blueprint: 'statistics',
        model: 'chart'
    },
    'POST /charts': {
        controller: 'Chart',
        model: 'chart',
        action: 'create'
    },
    'DELETE /charts': {
        controller: 'NotImplemented',
        model: 'chart',
        action: 'notImplemented'
    },
    'PATCH /charts': {
        controller: 'NotImplemented',
        model: 'chart',
        action: 'notImplemented'
    },
    'PUT /charts': {
        controller: 'NotImplemented',
        model: 'chart',
        action: 'notImplemented'
    },
    'GET /charts/first': {
        blueprint: 'first',
        model: 'chart'
    },
    'GET /charts/last': {
        blueprint: 'last',
        model: 'chart'
    },
    'GET /charts/search': {
        blueprint: 'search',
        model: 'chart'
    },
    'PUT /charts/:id': {
        controller: 'Chart',
        model: 'chart',
        action: 'update'
    },
    'HEAD /charts/*': {
        controller: 'Head',
        action: 'Head',
        model: 'chart'
    },
    'HEAD /charts': {
        controller: 'Head',
        action: 'Head',
        model: 'chart'
    },
    'OPTIONS /charts': {
        controller: 'Options',
        model: 'chart',
        action: 'collection'
    },
    'OPTIONS /charts/first': {
        controller: 'Options',
        model: 'chart',
        action: 'query'
    },
    'OPTIONS /charts/last': {
        controller: 'Options',
        model: 'chart',
        action: 'query'
    },
    'OPTIONS /charts/count': {
        controller: 'Options',
        model: 'chart',
        action: 'count'
    },
    'OPTIONS /charts/:id': {
        controller: 'Options',
        model: 'chart',
        action: 'instance'
    }
};
