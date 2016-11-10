"use strict";

/**
 * addStatus
 * @description :: Policy that adds underReview status if user has guest role
 */

const roles = require('../services/PermissionService').roles;

module.exports = (req, res, next) => {
    if (req.user.hasRole(roles.GUEST)) {
        Config.findOneByKey('underReviewStatus')
            .then(statusConfig => {
                req.body.status = statusConfig.value;
                next();
            });
    } else {
        next();
    }
};
