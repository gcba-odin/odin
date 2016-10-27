"use strict";

module.exports = {
    'GET /basemaps/statistics': {
        blueprint: 'statistics',
        model: 'basemap'
    },
    'DELETE /basemaps': {
        controller: 'NotImplemented',
        model: 'basemap',
        action: 'notImplemented'
    },
    'PATCH /basemaps': {
        controller: 'NotImplemented',
        model: 'basemap',
        action: 'notImplemented'
    },
    'PUT /basemaps': {
        controller: 'NotImplemented',
        model: 'basemap',
        action: 'notImplemented'
    },
    'DELETE /basemaps/:id': {
        controller: 'Destroy',
        model: 'basemap',
        action: 'destroy'
    },
    'POST /basemaps/:id/restore': {
        controller: 'Destroy',
        model: 'basemap',
        action: 'restore'
    },
    'POST /basemaps/:id/deactivate': {
        controller: 'Destroy',
        model: 'basemap',
        action: 'deactivate'
    },
    'GET /basemaps/first': {
        blueprint: 'first',
        model: 'basemap'
    },
    'GET /basemaps/last': {
        blueprint: 'last',
        model: 'basemap'
    },
    'GET /basemaps/search': {
        blueprint: 'search',
        model: 'basemap'
    },
    // 'PATCH /basemaps/:id': {
    //     blueprint: 'update',
    //     model: 'basemap',
    //     policy: 'isAuthenticated'
    // },
    'HEAD /basemaps/*': {
        controller: 'Head',
        action: 'Head',
        model: 'basemap'
    },
    'HEAD /basemaps': {
        controller: 'Head',
        action: 'Head',
        model: 'basemap'
    },
    'OPTIONS /basemaps': {
        controller: 'Options',
        model: 'basemap',
        action: 'collection'
    },
    'OPTIONS /basemaps/first': {
        controller: 'Options',
        model: 'basemap',
        action: 'query'
    },
    'OPTIONS /basemaps/last': {
        controller: 'Options',
        model: 'basemap',
        action: 'query'
    },
    'OPTIONS /basemaps/count': {
        controller: 'Options',
        model: 'basemap',
        action: 'count'
    },
    'OPTIONS /basemaps/:id': {
        controller: 'Options',
        model: 'basemap',
        action: 'instance'
    }
};
