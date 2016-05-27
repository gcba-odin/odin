"use strict";

/**
 * Config
 * @description :: Model for storing Config records
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
    description: {
      type: 'string',
      required: true,
      size: 250
    },
    type: {
      type: 'string',
      required: true,
      enum: ['bool', 'string', 'int', 'float']
    },
    key: {
      type: 'string',
      required: true,
      size: 100
    },
    value: {
      type: 'string',
      size: 250
    },
    updatedBy: {
      model: 'user'
    },

    toJSON() {
      return this.toObject();
    }
  }
};