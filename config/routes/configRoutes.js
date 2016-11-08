"use strict";

const readActions = require('../../api/services/PermissionService').readActions;

module.exports = {
    'GET /configs/first': {
        blueprint: 'first',
        model: 'config'
    },
    'GET /configs/last': {
        blueprint: 'last',
        model: 'config'
    },
    'GET /configs/search': {
        blueprint: 'search',
        model: 'config'
    },
    'GET /configs/statistics': {
        blueprint: 'statistics',
        model: 'config'
    },
    // 'PATCH /configs/:id': {
    //     blueprint: 'update',
    //     model: 'config',
    //     policy: 'isAuthenticated'
    // },
    'HEAD /configs/*': {
        controller: 'Head',
        action: 'Head',
        model: 'config'
    },
    'HEAD /configs': {
        controller: 'Head',
        action: 'Head',
        model: 'config'
    },
    'OPTIONS /configs': {
        controller: 'Options',
        model: 'config',
        action: 'collection'
    },
    'OPTIONS /configs/first': {
        controller: 'Options',
        model: 'config',
        action: 'query'
    },
    'OPTIONS /configs/last': {
        controller: 'Options',
        model: 'config',
        action: 'query'
    },
    'OPTIONS /configs/count': {
        controller: 'Options',
        model: 'config',
        action: 'count'
    },
    'OPTIONS /configs/:id': {
        controller: 'Options',
        model: 'config',
        action: 'instance'
    }
};
