const PermissionService = require('../../api/services/PermissionService');

var moment = require('moment');
const _ = require('lodash');
const roles = PermissionService.roles;
const actions = PermissionService.actions;

var now = moment().format('YYYY-MM-DD HH:mm:ss Z');
var permissions = _.flattenDeep([
    //Admin
    {
        role: roles.ADMIN,
        model: 'user',
        action: actions.READ
    }, {
        role: roles.ADMIN,
        model: 'user',
        action: actions.UPDATE
    },
    _.map(['organization', 'dataset', 'file', 'restservice', 'soapservice', 'chart', 'map',
        'category', 'tag', 'updatefrequency', 'status', 'filetype', 'basemap', 'config'
    ], (model) => [{
        role: roles.ADMIN,
        model: model,
        action: actions.CREATE
    }, {
        role: roles.ADMIN,
        model: model,
        action: actions.UPDATE
    }, {
        role: roles.ADMIN,
        model: model,
        action: actions.DESTROY
    }, {
        role: roles.ADMIN,
        model: model,
        action: actions.DEACTIVATE
    }, {
        role: roles.ADMIN,
        model: model,
        action: actions.RESTORE
    }]),
    _.map(['dataset', 'file', 'chart', 'map'], (model) => [{
        role: roles.ADMIN,
        model: model,
        action: actions.PUBLISH
    }, {
        role: roles.ADMIN,
        model: model,
        action: actions.UNPUBLISH
    }, {
        role: roles.ADMIN,
        model: model,
        action: actions.REJECT
    }]),

    //Guest
    _.map(['file', 'chart', 'map'], (model) => [{
        role: roles.GUEST,
        model: model,
        action: actions.CREATE
    }, {
        role: roles.GUEST,
        model: model,
        action: actions.UPDATE,
        owner: true
    }]), {
        role: roles.GUEST,
        model: 'tag',
        action: actions.CREATE
    }
]);
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('permissionrule', function(table) {
            table.string('action');
            table.increments();
            table.string('role');
            table.string('model');
            table.timestamp('createdAt').defaultTo(now);
            table.timestamp('updatedAt').defaultTo(now);
            table.timestamp('deletedAt');
            table.boolean('owner').defaultTo(false);
        }),
        knex('permissionrule').insert(permissions)

    ])

};

exports.down = function(knex, Promise) {

};
