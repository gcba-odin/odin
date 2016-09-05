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
        // '*': 'isAuthenticated',
        '*': ['statistics', 'ensureQueryTypeCast'],
        BasemapController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics']
        },
        CategoryController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        ChartController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        ConfigController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        DatasetController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        FileController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            upload: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        FileTypeController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics']
        },
        LogController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics']
        },
        MapController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy', 'addUrl'],
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        OptionsController: true,
        OrganizationController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        TagController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        },
        StatusController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics']
        },
        UserController: {
            create: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy'],
            login: true,
            refreshToken: true,
            destroy: ['isAuthenticated', 'statistics', 'ensureQueryTypeCast', 'addCreatedBy']
        }
    }
};
