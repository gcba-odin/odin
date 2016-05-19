"use strict";

/**
 * FileType
 * @description :: Model for storing FileType records
 */
var shortId = require('shortid');

module.exports = {
  schema: true,

  attributes: {
      id: {
          type: 'string',
          unique: true,
          index: true,
          defaultsTo: shortId.generate,
          primaryKey: true,
          size: 15
      },
      name: {
          type: 'string',
          required: true,
          size: 150
      },
      files: {
          collection: 'file',
          via: 'type'
      },

    toJSON() {
      return this.toObject();
    }
  },

  beforeUpdate: (values, next) => next(),
  beforeCreate: (values, next) => next()
};
