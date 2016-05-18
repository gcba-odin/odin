"use strict";

/**
 * Category
 * @description :: Model for storing Category records
 */
var shortId = require('shortid');

module.exports = {
  // schema: true,

  attributes: {
    // Fill your attributes here
    id: {
      type: 'string',
      unique: true,
      index: true,
      defaultsTo: shortId.generate,
      primaryKey: true
    },
    toJSON() {
      return this.toObject();
    }
  },

  beforeUpdate: (values, next) => next(),
  beforeCreate: (values, next) => next()
};
