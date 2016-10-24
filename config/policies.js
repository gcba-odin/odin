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
            create: ['isAuthenticated', 'statistics', 'hasPermission'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        CategoryController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            image: ['addLoggedUser', 'statistics']
        },
        ChartController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            destroy: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            publish: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            unpublish: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        ConfigController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            destroy: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        DatasetController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            destroy: ['isAuthenticated', 'statistics','hasPermission', 'isOwner'],
            publish: ['isAuthenticated', 'statistics','hasPermission', 'isOwner'],
            unpublish: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        FileController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            destroy: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            publish: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            unpublish: ['isAuthenticated', 'statistics', 'hasPermission' ,'isOwner']
        },
        RestServiceController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        SoapServiceController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        FileTypeController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        LogController: {
            create: ['isAuthenticated', 'statistics'],
            update: ['isAuthenticated', 'statistics'],
            destroy: ['isAuthenticated', 'statistics']
        },
        MapController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy', 'addUrl'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            destroy: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            publish: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            unpublish: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        OptionsController: true,
        OrganizationController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        TagController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy']
        },
        StatusController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        },
        UserController: {
            create: ['isAuthenticated', 'statistics', 'hasPermission', 'addCreatedBy'],
            update: ['isAuthenticated', 'statistics', 'hasPermission', 'isHimself'],
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
            destroy: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            restore: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner'],
            deactivate: ['isAuthenticated', 'statistics', 'hasPermission', 'isOwner']
        }
    }
};
