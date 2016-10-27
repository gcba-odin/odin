"use strict";

const readActions = require('../../api/services/PermissionService').readActions;

module.exports = {
    'POST /users/login': 'User.login',
    'POST /clients/tokens': 'User.refreshToken',
    'GET /roles': 'UserRoleController.find',
    'GET /users': {
        controller: 'RestrictedRead',
        model: 'user',
        action: readActions.FIND
    },
    'GET /users/search': {
        controller: 'RestrictedRead',
        model: 'user',
        action: readActions.SEARCH
    },
    'GET /users/first': {
        controller: 'RestrictedRead',
        model: 'user',
        action: readActions.FIRST
    },
    'GET /users/last': {
        controller: 'RestrictedRead',
        model: 'user',
        action: readActions.LAST
    },
    'GET /users/statistics': {
        controller: 'RestrictedRead',
        model: 'user',
        action: readActions.STATISTICS
    },
    'GET /users/:id': {
        controller: 'RestrictedRead',
        model: 'user',
        action: readActions.FIND_ONE
    },
    'DELETE /users/:id': {
        controller: 'Destroy',
        model: 'user',
        action: 'destroy'
    },
    'POST /users/:id/restore': {
        controller: 'Destroy',
        model: 'user',
        action: 'restore'
    },
    'POST /users/:id/deactivate': {
        controller: 'Destroy',
        model: 'user',
        action: 'deactivate'
    },
    // 'PATCH /users/:id': {
    //     blueprint: 'update',
    //     model: 'user',
    //     policies: 'isAuthenticated'
    // },
    'OPTIONS /users': {
        controller: 'Options',
        model: 'user',
        action: 'collection'
    },
    'OPTIONS /users/login': {
        controller: 'Options',
        model: 'user',
        action: 'custom'
    },
    'OPTIONS /users/first': {
        controller: 'Options',
        model: 'user',
        action: 'query'
    },
    'OPTIONS /users/last': {
        controller: 'Options',
        model: 'user',
        action: 'query'
    },
    'OPTIONS /users/count': {
        controller: 'Options',
        model: 'user',
        action: 'count'
    },
    'OPTIONS /users/:id': {
        controller: 'Options',
        model: 'user',
        action: 'instance'
    },
    'HEAD /users/*': {
        controller: 'Head',
        action: 'Head',
        model: 'user'
    },
    'HEAD /users': {
        controller: 'Head',
        action: 'Head',
        model: 'user'
    }
};
