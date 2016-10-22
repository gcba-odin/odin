"use strict";

/**
 * PermissionRule.js
 * @description :: Model for storing user permission rule
 */

const shortId = require('shortid');
const _ = require('lodash');
const actions = require('../services/PermissionConstantService').actions;

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
        action: {
            type: 'string',
            required: true,
            enum: _.values(actions)
        },
        role: {
            type: 'string',
            required: true
        },
        model: {
            type: 'string',
            required: true
        },
        owner: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};
