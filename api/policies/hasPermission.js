"use strict";

const roles = require('../services/PermissionConstantService').roles;

/**
 * hasPermission
 * @description :: Policy that validates if user has permission to perform an action
 */

module.exports = (req, res, next) => {
    if (req.user.role === roles.SUPERADMIN) {
        return next();
    }

    PermissionRule.findOne({
        role: req.user.role,
        action: req.options.action,
        model: req.options.model
    }).then(found => {
        return found ? next() : res.forbidden();
    });
};
