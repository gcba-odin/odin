"use strict";

/**
 * UserController
 * @description :: Server-side logic for manage users
 */
const _ = require('lodash');
const passport = require('passport');
const requestify = require('requestify');
const jwt = require('jwt-simple');


module.exports = {

    /**
     * Sign in by email\password
     * @param req
     * @param res
     */
    login(req, res) {
        var secret = sails.config.odin.recaptchaSecret;
        var response = req.param('g-recaptcha-response');
        requestify.get('https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=' + response)
            .then(function(response) {
                var data = response.getBody();
                if (data.success) {
                    passport.authenticate('local', _.partial(sails.config.passport.onPassportAuth, req, res))(req, res);
                } else {
                    return res.forbidden(data);
                }
            });
    },

    refreshToken(req, res) {
        var consumerId = req.param('consumerId');
        var consumerUsername = req.param('consumer');

        if (_.isUndefined(consumerId) || _.isUndefined(consumerUsername)) {
            return res.badRequest(null, {
                message: 'consumerId & consumer parameters are mandatory'
            });
        } else {
            requestify.post(sails.config.odin.kongAdmin + '/consumers/' + consumerUsername + '/jwt', {
                    consumer_id: consumerId
                })
                .then(function(response) {
                    // Get the response body
                    var credential = response.getBody();
                    var payload = {
                        iss: credential.key
                    };
                    var secret = credential.secret;
                    var token = jwt.encode(payload, secret);
                    return res.ok(token);
                });
        }
    }
};