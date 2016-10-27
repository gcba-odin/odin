"use strict";

const _ = require('lodash');

module.exports = {
    roles: {
        SUPERADMIN: 'superadmin',
        ADMIN: 'admin',
        GUEST: 'guest'
    },
    actions: {
        CREATE: 'create',
        READ: 'read',
        UPDATE: 'update',
        DESTROY: 'destroy',
        DEACTIVATE: 'deactivate',
        RESTORE: 'restore',
        PUBLISH: 'publish',
        UNPUBLISH: 'unpublish',
        REJECT: 'reject'
    },
    readActions: {
        FIND: 'find',
        FIND_ONE: 'findone',
        FIRST: 'first',
        LAST: 'last',
        SEARCH: 'search',
        STATISTICS: 'statistics'
    },
    getAction: function(req) {
        return _.includes(_.values(this.readActions), req.options.action) ? this.actions.READ : req.options.action;
    }
};
