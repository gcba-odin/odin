"use strict";

/**
 * StatisticController
 * @description :: Server-side logic for ...
 */
const _ = require('lodash');

module.exports = {
    downloads(req, res) {
        Statistic.query('select * from downloads()', function(err, result) {
            result = result.rows
            return res.ok(result)
        });
    }
};
