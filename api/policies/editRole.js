"use strict";

/**
 * editRole
 * @description :: Policy that validates if role is updated only by superadmin
 */

module.exports = (req, res, next) => {
    if (!req.user.isSuperAdmin()){
      delete req.body.role;
    }
    next();
};
