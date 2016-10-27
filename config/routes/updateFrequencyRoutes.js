"use strict";

module.exports = {
    'GET /updatefrequencies/statistics': {
        blueprint: 'statistics',
        model: 'updatefrequency'
    },
    'GET /updatefrequencies/first': {
        blueprint: 'first',
        model: 'updatefrequency'
    },
    'GET /updatefrequencies/search': {
        blueprint: 'search',
        model: 'updatefrequency'
    },
    'GET /updatefrequencies/last': {
        blueprint: 'last',
        model: 'updatefrequency'
    },
    // 'PATCH /updatefrequencies/:id': {
    //     blueprint: 'update',
    //     model: 'updatefrequency',
    //     policy: 'isAuthenticated'
    // },
    'HEAD /updatefrequencies/*': {
        controller: 'Head',
        action: 'Head',
        model: 'updatefrequency'
    },
    'HEAD /updatefrequencies': {
        controller: 'Head',
        action: 'Head',
        model: 'updatefrequency'
    },
    'OPTIONS /updatefrequencies': {
        controller: 'Options',
        model: 'updatefrequency',
        action: 'collection'
    },
    'OPTIONS /updatefrequencies/first': {
        controller: 'Options',
        model: 'updatefrequency',
        action: 'query'
    },
    'OPTIONS /updatefrequencies/last': {
        controller: 'Options',
        model: 'updatefrequency',
        action: 'query'
    },
    'OPTIONS /updatefrequencies/count': {
        controller: 'Options',
        model: 'updatefrequency',
        action: 'count'
    },
    'OPTIONS /updatefrequencies/:id': {
        controller: 'Options',
        model: 'updatefrequency',
        action: 'instance'
    }
};
