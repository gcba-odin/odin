"use strict";

/**
 * Policy Mappings
 *
 * Policies are simple functions which run before your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 */

module.exports = {
    policies: {
        '*': 'statistics',
        // '*': 'isAuthenticated',
        // UserController: {
        //    'login': true
        // }
        CategoryController: {
            upload: ['addCreatedBy', 'addUrl']
        },
        FileController: {
            create: ['addCreatedBy', 'addUrl'],
            upload: ['addCreatedBy', 'addUrl']
        },
        OrganizationController: {
            create: ['addCreatedBy']
        },
        TagController: {
            create: ['addCreatedBy']
        },
        UserController: {
            create: ['addCreatedBy']
        },
        ConfigController: {
            create: ['addCreatedBy']
        },
        MapController: {
            create: ['addCreatedBy', 'addUrl']
        },
        ChartController: {
            create: ['addCreatedBy', 'addUrl']
        }
    }
};
