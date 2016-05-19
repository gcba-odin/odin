"use strict";

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

module.exports = {
    routes: {
        'PATCH /users/:id' : { blueprint: 'update', model: 'user' },
        // 'HEAD /users': { blueprint: 'update', model: 'user' },
        // 'OPTIONS /users': { blueprint: 'update', model: 'user' },
        'GET /users/first': { blueprint: 'first', model: 'user' },
        // 'HEAD /users/first': { blueprint: 'update', model: 'user' },
        // 'OPTIONS /users/first': { blueprint: 'update', model: 'user' },
        'GET /users/last': { blueprint: 'last', model: 'user' },
        // 'HEAD /users/last': { blueprint: 'update', model: 'user' },
        // 'OPTIONS /users/last': { blueprint: 'update', model: 'user' },
        // 'HEAD /users/count': { blueprint: 'update', model: 'user' },
        // 'OPTIONS /users/count': { blueprint: 'update', model: 'user' },
        // 'HEAD /users/:id': { blueprint: 'update', model: 'user' },
        // 'OPTIONS /users/:id': { blueprint: 'update', model: 'user' },
        // 'HEAD /users/login': { blueprint: 'update', model: 'user' },
        // 'OPTIONS /users/login': { blueprint: 'update', model: 'user' },
    }
};
