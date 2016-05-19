"use strict";

/**
 * UserController
 * @description :: Server-side logic for manage users
 */
const _ = require('lodash');
const passport = require('passport');

module.exports = {

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },
    
  /**
   * Sign in by email\password
   * @param req
   * @param res
   */
  signin(req, res) {
    passport.authenticate('local', _.partial(sails.config.passport.onPassportAuth, req, res))(req, res);
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
