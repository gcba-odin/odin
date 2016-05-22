"use strict";

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

module.exports = {
    routes: {
        'POST /users/login': 'User.login',
        'GET /users/foo': 'User.foo',
        'GET /users/refreshToken': 'User.refreshToken',
        'PATCH /users/:id' : { blueprint: 'update', model: 'user' },
        'HEAD /users': { controller: 'Head', action: 'Head', model: 'user'},
        'HEAD /users/first': { controller: 'Head', action: 'Head', model: 'user'},
        'GET /users/first': { blueprint: 'first', model: 'user' },
        'GET /users/last': { blueprint: 'last', model: 'user' },
        'HEAD /users/last': {controller: 'Head', action: 'Head', model: 'user'},
        'HEAD /users/:id': { controller: 'Head', action: 'Head', model: 'user'},
        // 'OPTIONS /users/:id': { blueprinst: 'update', model: 'user' },
        'HEAD /users/login': {controller: 'Head', action: 'Head', model: 'user' },
    }
};
