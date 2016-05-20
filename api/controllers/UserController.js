"use strict";

/**
 * UserController
 * @description :: Server-side logic for manage users
 */
const _ = require('lodash');
const passport = require('passport');

module.exports = {

    /**
     * Sign in by email\password
     * @param req
     * @param res
     */
    login(req, res) {
        passport.authenticate('local', _.partial(sails.config.passport.onPassportAuth, req, res))(req, res);
    },
    
    foo(req,res){
        User.findOne({ sort: "createdAt ASC"}).exec(function (err, record) {
            console.log(record);
            record.getFullName();

        });
    },
    /**
     * Accept JSON Web Token and updates with new one
     * @param req
     * @param res
     */
    refreshToken(req, res) {
        if (!req.param('token')) return res.badRequest(null, {message: 'You must provide token parameter'});

        const oldDecoded = CipherService.jwt.decodeSync(req.param('token'));

        res.ok({
            token: CipherService.jwt.encodeSync({id: oldDecoded.id})
        });
    }
};
