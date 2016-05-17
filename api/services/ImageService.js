"use strict";

const image = require('sails-service-image');
const config = require('../../config/services/image');

module.exports = image('IM', config.services.image);
