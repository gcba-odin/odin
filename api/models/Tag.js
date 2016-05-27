"use strict";

/**
 * Tag
 * @description :: Model for storing Tag records
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
      size: 15,
      minLength: 14
    },
    name: {
      type: 'string',
      required: true,
      size: 100,
      minLength: 1
    },
    datasets: {
      collection: 'dataset',
      via: 'tags'
    },
    createdBy: {
      model: 'user',
      required: true
    },

    toJSON() {
      return this.toObject();
    }
  }
};