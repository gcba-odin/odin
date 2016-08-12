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
        '*': ['statistics', 'ensureQueryTypeCast'],
        // '*': 'isAuthenticated',
        // UserController: {
        //    'login': true
        // }
        CategoryController: {
            upload: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl']
        },
        FileController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            upload: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl']
        },
        OrganizationController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        TagController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        UserController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        ConfigController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        MapController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl']
        },
        ChartController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl']
        }
    }
};