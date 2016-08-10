"use strict";

/**
 * UserController
 * @description :: Server-side logic for manage users
 */
const _ = require('lodash');
const passport = require('passport');
var requestify = require('requestify');

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
        console.log('before post')
        requestify.post(sails.config.odin.kongAdmin, {
                consumer_id: '7fb5addf-5263 - 4a28-91dd-8f9bbc44ab16',
                created_at: Date.now(),
                id: '633cc788-2568-4254-84d8-2871cad8efff',
                key: '99afc57fdbc04c6cb2dd4ba5690e4346',
                secret: 'dcc01414b70e4f45aa2371b9b82ef95e'
            })
            .then(function (response) {
                // Get the response body
                console.dir(response.getBody());
            });
    }
};
