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
    'status',
    'statistic',
    'basemap',
    'metric'
];

module.exports = {
    routes: _.reduce(models, (routes, model) => _.assign(routes, require('./routes/' + model + 'Routes')), {})

};
