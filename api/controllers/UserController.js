"use strict";

/**
 * UserController
 * @description :: Server-side logic for manage users
 */
const _ = require('lodash');
const passport = require('passport');
var requestify = require('requestify');
var jwt = require('jwt-simple');

module.exports = {

    /**
     * Sign in by email\password
     * @param req
     * @param res
     */
    login(req, res) {
        passport.authenticate('local', _.partial(sails.config.passport.onPassportAuth, req, res))(req, res);
    },

    /**
     * Accept JSON Web Token and updates with new one
     * @param req
     * @param res
     */
    // refreshToken(req, res) {
    //     if (!req.param('token')) return res.badRequest(null, {
    //         message: 'You must provide token parameter'
    //     });
    //
    //     const oldDecoded = CipherService.jwt.decodeSync(req.param('token'));
    //
    //     res.ok({
    //         token: CipherService.jwt.encodeSync({
    //             id: oldDecoded.id
    //         })
    //     });
    // }
    refreshToken(req, res) {
        var consumerId = req.param('consumerId');
        var consumerUsername = req.param('consumer')
        return res.ok('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI5OWFmYzU3ZmRiYzA0YzZjYjJkZDRiYTU2OTBlNDM0NiJ9.Uo0I98Fu3BX8XlOgSnIvfeFx2Z_LdqM8WNT4hSMdDDM')
            // requestify.post(sails.config.odin.kongAdmin + '/consumers/' + consumerUsername + '/jwt', {
            //         consumer_id: consumerId
            //     })
            //     .then(function(response) {
            //         // Get the response body
            //         var credential = response.getBody();
            //         var payload = {
            //             iss: credential.key
            //         };
            //         var secret = credential.secret
            //         var token = jwt.encode(payload, secret);
            //         return res.ok(token)
            //     });
    }
};