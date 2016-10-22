"use strict";

/**
 * isOwner
 * @description :: Policy that validates if the model which the user is looking for was created by him
 */

module.exports = (req, res, next) => {
    if (!req.permission || !req.permission.owner) {
        return next();
    }

    sails.models[req.options.model]
        .findOneById(req.params.id)
        .then(modelInstance => {
            if (modelInstance) {
                modelInstance.createdBy === req.user.id ? next() : res.forbidden();
            } else {
                res.notFound();
            }
        });
};
