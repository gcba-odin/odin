"use strict";

const readActions = require('../../api/services/PermissionService').readActions;

module.exports = {
    'GET /configs': {
        controller: 'RestrictedRead',
        model: 'config',
        action: readActions.FIND
    },
    'GET /configs/first': {
        controller: 'RestrictedRead',
        model: 'config',
        action: readActions.FIRST
    },
    'GET /configs/last': {
        controller: 'RestrictedRead',
        model: 'config',
        action: readActions.LAST
    },
    'GET /configs/search': {
        controller: 'RestrictedRead',
        model: 'config',
        action: readActions.SEARCH
    },
    'GET /configs/statistics': {
        controller: 'RestrictedRead',
        model: 'config',
        action: readActions.STATISTICS
    },
    'GET /configs/:id': {
        controller: 'RestrictedRead',
        model: 'config',
        action: readActions.FIND_ONE
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
