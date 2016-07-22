"use strict";

/**
 * isAuthenticated
 * @description :: Policy that inject user in `req` via JSON Web Token
 */

const passport = require('passport');

module.exports = (req, res, next) => {
    if (!req.get('X-Consumer-ID') || req.host !== sails.config.odin.kongHost)
        passport.authenticate('jwt', (error, user, info) => {
            if (error || !user) return res.negotiate(error || info);

            req.user = user;
            next();
        })(req, res);
};