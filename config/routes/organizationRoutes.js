"use strict";

module.exports = {
    'GET /organizations/statistics': {
        blueprint: 'statistics',
        model: 'organization'
    },
    'DELETE /organizations': {
        controller: 'NotImplemented',
        model: 'organization',
        action: 'notImplemented'
    },
    'PATCH /organizations': {
        controller: 'NotImplemented',
        model: 'organization',
        action: 'notImplemented'
    },
    'PUT /organizations': {
        controller: 'NotImplemented',
        model: 'organization',
        action: 'notImplemented'
    },
    'DELETE /organizations/:id': {
        controller: 'Destroy',
        model: 'organization',
        action: 'destroy'
    },
    'POST /organizations/:id/restore': {
        controller: 'Destroy',
        model: 'organization',
        action: 'restore'
    },
    'POST /organizations/:id/deactivate': {
        controller: 'Destroy',
        model: 'organization',
        action: 'deactivate'
    },
    'GET /organizations/first': {
        blueprint: 'first',
        model: 'organization'
    },
    'GET /organizations/last': {
        blueprint: 'last',
        model: 'organization'
    },
    'GET /organizations/search': {
        blueprint: 'search',
        model: 'organization'
    },
    // 'PATCH /organizations/:id': {
    //     blueprint: 'update',
    //     model: 'organization',
    //     policy: 'isAuthenticated'
    // },
    'HEAD /organizations/*': {
        controller: 'Head',
        action: 'Head',
        model: 'organization'
    },
    'HEAD /organizations': {
        controller: 'Head',
        action: 'Head',
        model: 'organization'
    },
    'OPTIONS /organizations': {
        controller: 'Options',
        model: 'organization',
        action: 'collection'
    },
    'OPTIONS /organizations/first': {
        controller: 'Options',
        model: 'organization',
        action: 'query'
    },
    'OPTIONS /organizations/last': {
        controller: 'Options',
        model: 'organization',
        action: 'query'
    },
    'OPTIONS /organizations/count': {
        controller: 'Options',
        model: 'organization',
        action: 'count'
    },
    'OPTIONS /organizations/:id': {
        controller: 'Options',
        model: 'organization',
        action: 'instance'
    }
};
