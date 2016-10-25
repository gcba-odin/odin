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
        '*': ['addLoggedUser', 'statistics'],
        BasemapController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics']
        },
        CategoryController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics'],
            image: ['addLoggedUser', 'statistics']
        },
        ChartController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics'],
            publish: ['isAuthenticated', 'statistics'],
            unpublish: ['isAuthenticated', 'statistics']
        },
        ConfigController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics']
        },
        DatasetController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics'],
            publish: ['isAuthenticated', 'statistics'],
            unpublish: ['isAuthenticated', 'statistics']
        },
        FileController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics'],
            publish: ['isAuthenticated', 'statistics'],
            unpublish: ['isAuthenticated', 'statistics']
        },
        RestServiceController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics']
        },
        SoapServiceController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics']
        },
        FileTypeController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics']
        },
        LogController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics']
        },
        MapController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics'],
            publish: ['isAuthenticated', 'statistics'],
            unpublish: ['isAuthenticated', 'statistics']
        },
        OptionsController: true,
        OrganizationController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics']
        },
        TagController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy']
        },
        StatusController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics']
        },
        UserController: {
            create: ['isAuthenticated', 'statistics', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics'],
            login: true,
            refreshToken: true
        },
        UserRoleController: {
            find: ['isAuthenticated']
        },
        RestrictedReadController: {
            find: ['isAuthenticated', 'statistics', 'hasPermission'],
            findone: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            last: ['isAuthenticated', 'statistics', 'hasPermission'],
            first: ['isAuthenticated', 'statistics', 'hasPermission'],
            search: ['isAuthenticated', 'statistics', 'hasPermission'],
            statistics: ['isAuthenticated', 'statistics', 'hasPermission']
        },
        DestroyController: {
            destroy: ['isAuthenticated', 'statistics'],
            restore: ['isAuthenticated', 'statistics'],
            deactivate: ['isAuthenticated', 'statistics']
        }
    }
};
