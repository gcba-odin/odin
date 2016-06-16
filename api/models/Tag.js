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
      size: 15
    },
    name: {
      type: 'string',
      required: true,
      unique: true,
      size: 100,
      minLength: 1
    },
    files: {
      collection: 'file',
      via: 'tags'
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
  },
  baseAttributes: {
    name: {
      type: 'string'
    },
    files: {
      type: 'object'
    },
    createdBy: {
      type: 'object'
    },
    datasets: {
      type: 'object'
    }
  },
  setAttributes() {
    return this.baseAttributes
  },
  getAttributes() {
    return _.merge({
      id: {
        type: 'string'
      },
      createdAt: {
        type: 'datetime'
      },
      updatedAt: {
        type: 'datetime'
      }
    }, this.baseAttributes)
  },
  searchables: ['name']
};