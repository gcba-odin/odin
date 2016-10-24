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
    },

    beforeValidate: [
        function validOwnerAttributeOnCreateAction(permission, next) {
            const invalidOwnerAttribute = permission.action === actions.CREATE && permission.owner;
            next(invalidOwnerAttribute ? new Error('Owner property cannot be true in create action permission') : null);
        },
        function alredyExists(permission, next) {
            PermissionRule
                .findOne({
                    role: permission.role,
                    action: permission.action,
                    model: permission.model,
                    owner: permission.owner
                })
                .then(foundPermission => next(foundPermission ? new Error('This permission rule already exists') : null));
        }
    ]
};
