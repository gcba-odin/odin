"use strict";

module.exports = {
    'GET /statuses/statistics': {
        blueprint: 'statistics',
        model: 'status'
    },
    'DELETE /statuses/:id': {
        controller: 'Destroy',
        model: 'status',
        action: 'destroy'
    },
    'POST /statuses/:id/restore': {
        controller: 'Destroy',
        model: 'status',
        action: 'restore'
    },
    'POST /statuses/:id/deactivate': {
        controller: 'Destroy',
        model: 'status',
        action: 'deactivate'
    },
    'GET /statuses/first': {
        blueprint: 'first',
        model: 'status'
    },
    'GET /statuses/last': {
        blueprint: 'last',
        model: 'status'
    },
    'GET /statuses/search': {
        blueprint: 'search',
        model: 'status'
    },
    // 'PATCH /statuses/:id': {
    //     blueprint: 'update',
    //     model: 'status',
    //     policy: 'isAuthenticated'
    // },
    'HEAD /statuses/*': {
        controller: 'Head',
        action: 'Head',
        model: 'status'
    },
    'HEAD /statuses': {
        controller: 'Head',
        action: 'Head',
        model: 'status'
    },
    'OPTIONS /statuses': {
        controller: 'Options',
        model: 'status',
        action: 'collection'
    },
    'OPTIONS /statuses/first': {
        controller: 'Options',
        model: 'status',
        action: 'query'
    },
    'OPTIONS /statuses/last': {
        controller: 'Options',
        model: 'status',
        action: 'query'
    },
    'OPTIONS /statuses/count': {
        controller: 'Options',
        model: 'status',
        action: 'count'
    },
    'OPTIONS /statuses/:id': {
        controller: 'Options',
        model: 'status',
        action: 'instance'
    }
};
