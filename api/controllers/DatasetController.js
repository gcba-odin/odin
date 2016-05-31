"use strict";

/**
 * DatasetController
 * @description :: Server-side logic for ...
 */

module.exports = {
    download: function (req, res) {
        const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
        const _pk = actionUtil.requirePk(req);

    }
};
