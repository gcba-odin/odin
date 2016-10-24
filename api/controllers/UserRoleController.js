"use strict";

/**
 * UserRoleController
 * @description :: Server-side logic for ...
 */

const roles = require('../services/PermissionConstantService').roles;

module.exports = {
    find: function(req, res) {
        res.json(_.values(roles));
    }
};
