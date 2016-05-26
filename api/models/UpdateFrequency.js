"use strict";

/**
 * UpdateFrequency
 * @description :: Model for storing UpdateFrequency records
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
      size: 100
    },
  }
};