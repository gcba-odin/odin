"use strict";

module.exports = {
    'POST /soapservices': {
        controller: 'soapservice',
        model: 'soapservice',
        action: 'create'
    },
    'PUT /soapservices/:id': {
        controller: 'soapservice',
        model: 'soapservice',
        action: 'update'
    },
    'DELETE /soapservices/:id': {
        controller: 'Destroy',
        model: 'soapservice',
        action: 'destroy'
    },
    'GET /soapservices/search': {
        blueprint: 'search',
        model: 'soapservice'
    },
    'GET /soapservices/last': {
        blueprint: 'last',
        model: 'soapservice'
    },
    'HEAD /soapservices/*': {
        controller: 'Head',
        action: 'Head',
        model: 'soapservice'
    },
    'HEAD /soapservices': {
        controller: 'Head',
        action: 'Head',
        model: 'soapservice'
    },
    'OPTIONS /soapservices': {
        controller: 'Options',
        model: 'soapservice',
        action: 'collection'
    },
    'OPTIONS /soapservices/first': {
        controller: 'Options',
        model: 'soapservice',
        action: 'query'
    },
    'OPTIONS /soapservices/last': {
        controller: 'Options',
        model: 'soapservice',
        action: 'query'
    },
    'OPTIONS /soapservices/count': {
        controller: 'Options',
        model: 'soapservice',
        action: 'count'
    },
    'OPTIONS /soapservices/:id': {
        controller: 'Options',
        model: 'soapservice',
        action: 'instance'
    }
};
