"use strict";

module.exports = {
    'POST /restservices': {
        controller: 'restservice',
        model: 'restservice',
        action: 'create'
    },
    'PUT /restservices/:id': {
        controller: 'restservice',
        model: 'restservice',
        action: 'update'
    },
    'DELETE /restservices/:id': {
        controller: 'Destroy',
        model: 'restservice',
        action: 'destroy'
    },
    'GET /restservices/search': {
        blueprint: 'search',
        model: 'restservice'
    },
    'GET /restservices/last': {
        blueprint: 'last',
        model: 'restservice'
    },
    'HEAD /restservices/*': {
        controller: 'Head',
        action: 'Head',
        model: 'restservice'
    },
    'HEAD /restservices': {
        controller: 'Head',
        action: 'Head',
        model: 'restservice'
    },
    'OPTIONS /restservices': {
        controller: 'Options',
        model: 'restservice',
        action: 'collection'
    },
    'OPTIONS /restservices/first': {
        controller: 'Options',
        model: 'restservice',
        action: 'query'
    },
    'OPTIONS /restservices/last': {
        controller: 'Options',
        model: 'restservice',
        action: 'query'
    },
    'OPTIONS /restservices/count': {
        controller: 'Options',
        model: 'restservice',
        action: 'count'
    },
    'OPTIONS /restservices/:id': {
        controller: 'Options',
        model: 'restservice',
        action: 'instance'
    }
};
