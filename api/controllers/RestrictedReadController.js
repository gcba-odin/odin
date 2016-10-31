"use strict";

/**
 * RestrictedReadController
 * @description :: Server-side logic for ...
 */

const find = require('../blueprints/find');
const findone = require('../blueprints/findone');
const first = require('../blueprints/first');
const last = require('../blueprints/last');
const search = require('../blueprints/search');
const statistics = require('../blueprints/statistics');

module.exports = {
    find: find,
    findone: findone,
    first: first,
    last: last,
    search: search,
    statistics: statistics
};