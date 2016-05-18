"use strict";

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

module.exports = {
    routes: {
        'PATCH /users/:id' : { blueprint: 'update', model: 'user' },
        'HEAD /users',
        'OPTIONS /users',
        'GET /users/first',
        'HEAD /users/first',
        'OPTIONS /users/first',
        'GET /users/last',
        'HEAD /users/last',
        'OPTIONS /users/last',
        'GET /users/count',
        'HEAD /users/count',
        'OPTIONS /users/count',
        'HEAD /users/:id',
        'OPTIONS /users/:id',
        'HEAD /users/login',
        'OPTIONS /users/login',
    }
};
