"use strict";

/**
 * Dataset
 * @description :: Model for storing Dataset records
 */

module.exports = {
  schema: true,

  attributes: {
    // Fill your attributes here

    toJSON() {
      return this.toObject();
    }
  },

  beforeUpdate: (values, next) => next(),
  beforeCreate: (values, next) => next()
};
