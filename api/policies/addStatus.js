"use strict";

/**
 * addStatus
 * @description :: Policy that adds underReview status if user has guest role
 */

const roles = require('../services/PermissionService').roles;

module.exports = (req, res, next) => {
    if (req.user.hasRole(roles.GUEST)) {
        req.body.status = sails.config.statuses.draft
        next();
    } else {
        Config.findOneByKey('defaultStatus')
            .then(statusConfig => {
                req.body.status = statusConfig.value;
                next();
            });

    }
};
