"use strict";

module.exports = {
    'GET /logs/statistics': {
        blueprint: 'statistics',
        model: 'log'
    },
    'GET /logs/first': {
        blueprint: 'first',
        model: 'log'
    },
    'GET /logs/last': {
        blueprint: 'last',
        model: 'log'
    },
    'GET /logs/search': {
        blueprint: 'search',
        model: 'log'
    },
    'HEAD /logs/*': {
        controller: 'Head',
        action: 'Head',
        model: 'log'
    },
    'HEAD /logs': {
        controller: 'Head',
        action: 'Head',
        model: 'log'
    },
    'OPTIONS /logs': {
        controller: 'Options',
        model: 'log',
        action: 'collection'
    },
    'OPTIONS /logs/first': {
        controller: 'Options',
        model: 'log',
        action: 'query'
    },
    'OPTIONS /logs/last': {
        controller: 'Options',
        model: 'log',
        action: 'query'
    },
    'OPTIONS /logs/count': {
        controller: 'Options',
        model: 'log',
        action: 'count'
    },
    'OPTIONS /logs/:id': {
        controller: 'Options',
        model: 'log',
        action: 'instance'
    }
};
