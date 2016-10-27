"use strict";

module.exports = {
    'GET /tags/statistics': {
        blueprint: 'statistics',
        model: 'tag'
    },
    'DELETE /tags/:id': {
        controller: 'Destroy',
        model: 'tag',
        action: 'destroy'
    },
    'POST /tags/:id/restore': {
        controller: 'Destroy',
        model: 'tag',
        action: 'restore'
    },
    'POST /tags/:id/deactivate': {
        controller: 'Destroy',
        model: 'tag',
        action: 'deactivate'
    },
    'GET /tags/first': {
        blueprint: 'first',
        model: 'tag'
    },
    'GET /tags/last': {
        blueprint: 'last',
        model: 'tag'
    },
    'GET /tags/search': {
        blueprint: 'search',
        model: 'tag'
    },
    // 'PATCH /tags/:id': {
    //     blueprint: 'update',
    //     model: 'tag',
    //     policy: 'isAuthenticated'
    // },
    'HEAD /tags/*': {
        controller: 'Head',
        action: 'Head',
        model: 'tag'
    },
    'HEAD /tags': {
        controller: 'Head',
        action: 'Head',
        model: 'tag'
    },
    'OPTIONS /tags': {
        controller: 'Options',
        model: 'tag',
        action: 'collection'
    },
    'OPTIONS /tags/first': {
        controller: 'Options',
        model: 'tag',
        action: 'query'
    },
    'OPTIONS /tags/last': {
        controller: 'Options',
        model: 'tag',
        action: 'query'
    },
    'OPTIONS /tags/count': {
        controller: 'Options',
        model: 'tag',
        action: 'count'
    },
    'OPTIONS /tags/:id': {
        controller: 'Options',
        model: 'tag',
        action: 'instance'
    }
};
