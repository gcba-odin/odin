"use strict";

module.exports = {
    'GET /datasetrequests/statistics': {
        blueprint: 'statistics',
        model: 'datasetrequest'
    },
    'GET /datasetrequests/first': {
        blueprint: 'first',
        model: 'datasetrequest'
    },
    'GET /datasetrequests/last': {
        blueprint: 'last',
        model: 'datasetrequest'
    },
    'GET /datasetrequests/search': {
        blueprint: 'search',
        model: 'datasetrequest'
    },
    'HEAD /datasetrequests/*': {
        controller: 'Head',
        action: 'Head',
        model: 'datasetrequest'
    },
    'HEAD /datasetrequests': {
        controller: 'Head',
        action: 'Head',
        model: 'datasetrequest'
    },
    'OPTIONS /datasetrequests': {
        controller: 'Options',
        model: 'datasetrequest',
        action: 'collection'
    },
    'OPTIONS /datasetrequests/first': {
        controller: 'Options',
        model: 'datasetrequest',
        action: 'query'
    },
    'OPTIONS /datasetrequests/last': {
        controller: 'Options',
        model: 'datasetrequest',
        action: 'query'
    },
    'OPTIONS /datasetrequests/count': {
        controller: 'Options',
        model: 'datasetrequest',
        action: 'count'
    },
    'OPTIONS /datasetrequests/:id': {
        controller: 'Options',
        model: 'datasetrequest',
        action: 'instance'
    }
};
