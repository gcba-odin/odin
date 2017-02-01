"use strict";

module.exports = (req, res, next) => {
    if (req.body.editable === true && !req.user.isSuperAdmin()) {
        res.forbidden();
    } else {
        next();
    }
};
