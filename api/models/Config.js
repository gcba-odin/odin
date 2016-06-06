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
      size: 250,
      minLength: 3
    },
    type: {
      type: 'string',
      required: true,
      enum: ['bool', 'string', 'int', 'float']
    },
    key: {
      type: 'string',
      required: true,
      size: 100,
      minLength: 1
    },
    value: {
      type: 'string',
      size: 250,
    },
    updatedBy: {
      model: 'user'
    },

    baseAttributes: {
      description: {
        type: 'string'
      },
      type: {
        type: 'string'
      },
      key: {
        type: 'string'
      },
      value: {
        type: 'string'
      },
      updatedBy: {
        model: 'user'
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

    toJSON() {
      return this.toObject();
    }
  }
};