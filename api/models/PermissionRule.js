/**
 * PermissionRule.js
 * @description :: Model for storing user permission rule
 */

const shortId = require('shortid');

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
            required: true
        },
        role: {
            type: 'string',
            required: true
        },
        model: {
            type: 'string',
            required: true
        }
    }
};

