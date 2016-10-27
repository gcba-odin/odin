"use strict";

module.exports = {
    'PATCH /maps/:id/publish': {
        controller: 'Map',
        model: 'map',
        action: 'publish'
    },
    'PATCH /maps/:id/unpublish': {
        controller: 'Map',
        model: 'map',
        action: 'unpublish'
    },
    'PATCH /maps/:id/reject': {
        controller: 'Map',
        model: 'map',
        action: 'reject'
    },
    'GET /maps/statistics': {
        blueprint: 'statistics',
        model: 'map'
    },
    'DELETE /maps': {
        controller: 'NotImplemented',
        model: 'map',
        action: 'notImplemented'
    },
    'PATCH /maps': {
        controller: 'NotImplemented',
        model: 'map',
        action: 'notImplemented'
    },
    'PUT /maps': {
        controller: 'NotImplemented',
        model: 'map',
        action: 'notImplemented'
    },
    'GET /maps/first': {
        blueprint: 'first',
        model: 'map'
    },
    'GET /maps/last': {
        blueprint: 'last',
        model: 'map'
    },
    'GET /maps/search': {
        blueprint: 'search',
        model: 'map'
    },
    'PUT /maps/:id': {
        controller: 'Map',
        model: 'map',
        action: 'update',
    },
    'HEAD /maps/*': {
        controller: 'Head',
        action: 'Head',
        model: 'map'
    },
    'HEAD /maps': {
        controller: 'Head',
        action: 'Head',
        model: 'map'
    },
    'OPTIONS /maps': {
        controller: 'Options',
        model: 'map',
        action: 'collection'
    },
    'OPTIONS /maps/first': {
        controller: 'Options',
        model: 'map',
        action: 'query'
    },
    'OPTIONS /maps/last': {
        controller: 'Options',
        model: 'map',
        action: 'query'
    },
    'OPTIONS /maps/count': {
        controller: 'Options',
        model: 'map',
        action: 'count'
    },
    'OPTIONS /maps/:id': {
        controller: 'Options',
        model: 'map',
        action: 'instance'
    }
};
