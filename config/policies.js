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
        '*': ['statistics', 'ensureQueryTypeCast', 'isAuthenticated'],
        OptionsController: true,
        CategoryController: {
            upload: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl', 'isAuthenticated']
        },
        FileController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl', 'isAuthenticated'],
            upload: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl', 'isAuthenticated']
        },
        OrganizationController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'isAuthenticated']
        },
        TagController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'isAuthenticated']
        },
        UserController: {
            login: true,
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'isAuthenticated']
        },
        ConfigController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'isAuthenticated']
        },
        MapController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl', 'isAuthenticated']
        },
        ChartController: {
            create: ['statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl', 'isAuthenticated']
        }
    }
};