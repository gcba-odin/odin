"use strict";

/**
 * hasPermission
 * @description :: Policy that validates if user has permission to perform an action
 */

const permissionService = require('../services/PermissionService');

module.exports = (req, res, next) => {
    if (req.user.isSuperAdmin()) {
        return next();
    }

   PermissionRule
        .findOne({
            role: req.user.role,
            action: permissionService.getAction(req),
            model: req.options.model
        })
        .then(permission => {
            if (permission) {
                req.permission = permission;
                next();
            } else {
                res.forbidden();
            }
        });
};
