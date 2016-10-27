"use strict";

module.exports = {
    'GET /categories/statistics': {
        blueprint: 'statistics',
        model: 'category'
    },
    'POST /categories': {
        controller: 'Category',
        model: 'category',
        action: 'create'
    },
    'PUT /categories/:id': {
        controller: 'Category',
        model: 'category',
        action: 'update'
    },
    'GET /categories/:id/image': {
        controller: 'Category',
        model: 'category',
        action: 'image'
    },
    'DELETE /categories': {
        controller: 'NotImplemented',
        model: 'category',
        action: 'notImplemented'
    },
    'PATCH /categories': {
        controller: 'NotImplemented',
        model: 'category',
        action: 'notImplemented'
    },
    'PUT /categories': {
        controller: 'NotImplemented',
        model: 'category',
        action: 'notImplemented'
    },
    'DELETE /categories/:id': {
        controller: 'Destroy',
        model: 'category',
        action: 'destroy'
    },
    'POST /categories/:id/restore': {
        controller: 'Destroy',
        model: 'category',
        action: 'restore'
    },
    'POST /categories/:id/deactivate': {
        controller: 'Destroy',
        model: 'category',
        action: 'deactivate'
    },
    'GET /categories/first': {
        blueprint: 'first',
        model: 'category'
    },
    'GET /categories/last': {
        blueprint: 'last',
        model: 'category'
    },
    'GET /categories/search': {
        blueprint: 'search',
        model: 'category'
    },
    'HEAD /categories/*': {
        controller: 'Head',
        action: 'Head',
        model: 'category'
    },
    'HEAD /categories': {
        controller: 'Head',
        action: 'Head',
        model: 'category'
    },
    'OPTIONS /categories': {
        controller: 'Options',
        model: 'category',
        action: 'collection'
    },
    'OPTIONS /categories/first': {
        controller: 'Options',
        model: 'category',
        action: 'query'
    },
    'OPTIONS /categories/last': {
        controller: 'Options',
        model: 'category',
        action: 'query'
    },
    'OPTIONS /categories/count': {
        controller: 'Options',
        model: 'category',
        action: 'count'
    },
    'OPTIONS /categories/:id': {
        controller: 'Options',
        model: 'category',
        action: 'instance'
    }
};
