"use strict";

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

const _ = require('lodash');

const models = [
    'user',
    'organization',
    'category',
    'status',
    'mail',
    'fileType',
    'file',
    'restService',
    'soapService',
    'dataset',
    'tag',
    'updateFrequency',
    'config',
    'log',
    'map',
    'chart',
    'statistic',
    'basemap'
];

module.exports = {
    routes: _.reduce(models, (routes, model) => _.assign(routes, require('./routes/' + model + 'Routes')), {})



    }
};
