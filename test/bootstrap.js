"use strict";

const Sails = require('sails');
const config = require('../config/env/test');

let sails;

before(done => {
  this.timeout(5000);
  Sails.lift(config, (error, server) => {
    if (error) return done(error);

    sails = server;
    done();
  });
});

after(done => sails.lower(done));