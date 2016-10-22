"use strict";

/**
 * isOwner
 * @description :: Policy that validates if user is trying to update his own fields
 */

module.exports = (req, res, next) => {
    return req.params.id === req.user.id ? next() : res.forbidden();
};
