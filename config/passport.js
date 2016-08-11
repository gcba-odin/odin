"use strict";

/**
 * Passport configuration file where you should configure all your strategies
 * @description :: Configuration file where you configure your passport authentication
 */

const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

/**
 * Configuration object for local strategy
 * @type {Object}
 * @private
 */
const LOCAL_STRATEGY_CONFIG = {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
};

/**
 * Configuration object for JWT strategy
 * @type {Object}
 * @private
 */
const JWT_STRATEGY_CONFIG = {
    secretOrKey: 'c5158dbb8972e48256e18d69d401e938068bf6100f1418c4ab2fcdf25dc9c1b0',
    jwtFromRequest: ExtractJwt.fromHeader('X-Admin-Authorization'),
    tokenQueryParameterName: 'access_token',
    authScheme: 'Bearer',
    session: false,
    passReqToCallback: true
};

/**
 * Triggers when user authenticates via local strategy
 * @param {Object} req Request object
 * @param {String} username Username from body field in request
 * @param {String} password Password from body field in request
 * @param {Function} next Callback
 * @private
 */
const _onLocalStrategyAuth = (req, username, password, next) => {
    User
        .findOne({
            [LOCAL_STRATEGY_CONFIG.usernameField]: username
        })
        .then(user => {
            if (!user) return next(null, null, sails.config.errors.USER_NOT_FOUND);
            if (!HashService.bcrypt.compareSync(password, user.password))
                return next(null, null, sails.config.errors.USER_NOT_FOUND);
            return next(null, user, {});
        })
        .catch(next);
};

/**
 * Triggers when user authenticates via JWT strategy
 * @param {Object} req Request object
 * @param {Object} payload Decoded payload from JWT
 * @param {Function} next Callback
 * @private
 */
const _onJwtStrategyAuth = (req, payload, next) => {
    User
        .findOne({
            id: payload.id
        })
        .then(user => {
            if (!user) return next(null, null, sails.config.errors.USER_NOT_FOUND);
            return next(null, user, {});
        })
        .catch(next);
};

module.exports = {
    passport: {
        /**
         * Triggers when all Passport steps is done and user profile is parsed
         * @param {Object} req Request object
         * @param {Object} res Response object
         * @param {Object} error Object with error info
         * @param {Object} user User object
         * @param {Object} info Information object
         * @returns {*}
         * @private
         */
        onPassportAuth(req, res, error, user, info) {
            if (error || !user) return res.negotiate(error || info);

            return res.ok({
                token: CipherService.jwt.encodeSync({
                    id: user.id
                }),
                user: user.id,
                username: user.username
                    // We dont need user data returned
                    // user: user
            });
        }
    }
};

passport.use(new LocalStrategy(_.assign({}, LOCAL_STRATEGY_CONFIG), _onLocalStrategyAuth));
passport.use(new JwtStrategy(_.assign({}, JWT_STRATEGY_CONFIG), _onJwtStrategyAuth));