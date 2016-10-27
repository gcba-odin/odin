"use strict";

module.exports = {
    'POST /statistics': {
        controller: 'NotImplemented',
        model: 'statistic',
        action: 'notImplemented'
    },
    'DELETE /statistics': {
        controller: 'NotImplemented',
        model: 'statistic',
        action: 'notImplemented'
    },
    'PATCH /statistics': {
        controller: 'NotImplemented',
        model: 'statistic',
        action: 'notImplemented'
    },
    'PUT /statistics': {
        controller: 'NotImplemented',
        model: 'statistic',
        action: 'notImplemented'
    },
    'GET /statistics/first': {
        blueprint: 'first',
        model: 'statistic'
    },
    'GET /statistics/last': {
        blueprint: 'last',
        model: 'statistic'
    },
    'HEAD /statistics/*': {
        controller: 'Head',
        action: 'Head',
        model: 'statistic'
    },
    'HEAD /statistics': {
        controller: 'Head',
        action: 'Head',
        model: 'statistic'
    },
    'OPTIONS /statistics': {
        controller: 'Options',
        model: 'statistic',
        action: 'collection'
    },
    'OPTIONS /statistics/first': {
        controller: 'Options',
        model: 'statistic',
        action: 'query'
    },
    'OPTIONS /statistics/last': {
        controller: 'Options',
        model: 'statistic',
        action: 'query'
    },
    'OPTIONS /statistics/count': {
        controller: 'Options',
        model: 'statistic',
        action: 'count'
    },
    'OPTIONS /statistics/:id': {
        controller: 'Options',
        model: 'statistic',
        action: 'instance'
    }
};
