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
        '*': ['isAuthenticated','statistics', 'ensureQueryTypeCast'],
        // '*': 'isAuthenticated',
        OptionsController: true,
        CategoryController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl']
        },
        FileController: {
            create: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            upload: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl']
        },
        OrganizationController: {
            create: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        TagController: {
            create: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        UserController: {
            create: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
           login: true,
           refreshToken: true
        },
        ConfigController: {
            create: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        MapController: {
            create: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl']
        },
        ChartController: {
            create: ['isAuthenticated','statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl']
        }
    }
};