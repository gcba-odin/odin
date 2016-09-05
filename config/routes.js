"use strict";

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

module.exports = {
    routes: {

        // Users
        'POST /users/login': 'User.login',
        'POST /clients/tokens': 'User.refreshToken',

        'GET /users/statistics': {
            blueprint: 'statistics',
            model: 'user'
        },

        'DELETE /users/:id': {
            controller: 'Delete',
            model: 'user',
            action: 'delete',
        },
        'POST /users/:id/restore': {
            controller: 'Delete',
            model: 'user',
            action: 'restore',
        },

        'GET /users/search': {
            blueprint: 'search',
            model: 'user'
        },
        'GET /users/first': {
            blueprint: 'first',
            model: 'user'
        },

        'GET /users/last': {
            blueprint: 'last',
            model: 'user'
        },

        'PATCH /users/:id': {
            blueprint: 'update',
            model: 'user',
            policy: 'isAuthenticated'
        },

        'OPTIONS /users': {
            controller: 'Options',
            model: 'user',
            action: 'collection'
        },
        'OPTIONS /users/login': {
            controller: 'Options',
            model: 'user',
            action: 'custom'
        },

        'OPTIONS /users/first': {
            controller: 'Options',
            model: 'user',
            action: 'query'
        },
        'OPTIONS /users/last': {
            controller: 'Options',
            model: 'user',
            action: 'query'
        },

        'OPTIONS /users/count': {
            controller: 'Options',
            model: 'user',
            action: 'count'
        },

        'OPTIONS /users/:id': {
            controller: 'Options',
            model: 'user',
            action: 'instance'
        },

        'HEAD /users/*': {
            controller: 'Head',
            action: 'Head',
            model: 'user'
        },
        'HEAD /users': {
            controller: 'Head',
            action: 'Head',
            model: 'user'
        },

        // Organizations

        'GET /organizations/statistics': {
            blueprint: 'statistics',
            model: 'organization'
        },

        'DELETE /organizations': {
            controller: 'NotImplemented',
            model: 'organization',
            action: 'notImplemented'
        },

        'PATCH /organizations': {
            controller: 'NotImplemented',
            model: 'organization',
            action: 'notImplemented'
        },
        'PUT /organizations': {
            controller: 'NotImplemented',
            model: 'organization',
            action: 'notImplemented'
        },

        'DELETE /organizations/:id': {
            controller: 'Delete',
            model: 'organization',
            action: 'delete',
            policy: 'isAuthenticated'
        },
        'POST /organizations/:id/restore': {
            controller: 'Delete',
            model: 'organization',
            action: 'restore',
            policy: 'isAuthenticated'
        },

        'GET /organizations/first': {
            blueprint: 'first',
            model: 'organization'
        },

        'GET /organizations/last': {
            blueprint: 'last',
            model: 'organization'
        },

        'GET /organizations/search': {
            blueprint: 'search',
            model: 'organization'
        },

        'PATCH /organizations/:id': {
            blueprint: 'update',
            model: 'organization',
            policy: 'isAuthenticated'
        },
        'HEAD /organizations/*': {
            controller: 'Head',
            action: 'Head',
            model: 'organization'
        },
        'HEAD /organizations': {
            controller: 'Head',
            action: 'Head',
            model: 'organization'
        },

        'OPTIONS /organizations': {
            controller: 'Options',
            model: 'organization',
            action: 'collection'
        },
        'OPTIONS /organizations/first': {
            controller: 'Options',
            model: 'organization',
            action: 'query'
        },
        'OPTIONS /organizations/last': {
            controller: 'Options',
            model: 'organization',
            action: 'query'
        },
        'OPTIONS /organizations/count': {
            controller: 'Options',
            model: 'organization',
            action: 'count'
        },
        'OPTIONS /organizations/:id': {
            controller: 'Options',
            model: 'organization',
            action: 'instance'
        },


        // Categories

        'GET /categories/statistics': {
            blueprint: 'statistics',
            model: 'category'
        },

        'POST /categories': {
            controller: 'Category',
            model: 'category',
            action: 'create',
            policy: 'isAuthenticated'
        },
        'PATCH /categories/:id': {
            controller: 'Category',
            model: 'category',
            action: 'update',
            policy: 'isAuthenticated'
        },
        'GET /categories/:id/image': 'Category.image',

        'DELETE /categories': {
            controller: 'NotImplemented',
            model: 'category',
            action: 'notImplemented'
        },

        'PATCH /categories': {
            controller: 'NotImplemented',
            model: 'category',
            action: 'notImplemented'
        },
        'PUT /categories': {
            controller: 'NotImplemented',
            model: 'category',
            action: 'notImplemented'
        },

        'DELETE /categories/:id': {
            controller: 'Delete',
            model: 'category',
            action: 'delete',
            policy: 'isAuthenticated'
        },
        'POST /categories/:id/restore': {
            controller: 'Delete',
            model: 'category',
            action: 'restore',
            policy: 'isAuthenticated'
        },
        'GET /categories/first': {
            blueprint: 'first',
            model: 'category'
        },
        'GET /categories/last': {
            blueprint: 'last',
            model: 'category'
        },
        'GET /categories/search': {
            blueprint: 'search',
            model: 'category'
        },
        'HEAD /categories/*': {
            controller: 'Head',
            action: 'Head',
            model: 'category'
        },
        'HEAD /categories': {
            controller: 'Head',
            action: 'Head',
            model: 'category'
        },

        'OPTIONS /categories': {
            controller: 'Options',
            model: 'category',
            action: 'collection'
        },
        'OPTIONS /categories/first': {
            controller: 'Options',
            model: 'category',
            action: 'query'
        },
        'OPTIONS /categories/last': {
            controller: 'Options',
            model: 'category',
            action: 'query'
        },
        'OPTIONS /categories/count': {
            controller: 'Options',
            model: 'category',
            action: 'count'
        },
        'OPTIONS /categories/:id': {
            controller: 'Options',
            model: 'category',
            action: 'instance'
        },


        // Statuses

        'GET /statuses/statistics': {
            blueprint: 'statistics',
            model: 'status'
        },


        'GET /statuses/first': {
            blueprint: 'first',
            model: 'status'
        },
        'GET /statuses/last': {
            blueprint: 'last',
            model: 'status'
        },
        'GET /statuses/search': {
            blueprint: 'search',
            model: 'status'
        },
        'PATCH /statuses/:id': {
            blueprint: 'update',
            model: 'status',
            policy: 'isAuthenticated'
        },
        'HEAD /statuses/*': {
            controller: 'Head',
            action: 'Head',
            model: 'status'
        },
        'HEAD /statuses': {
            controller: 'Head',
            action: 'Head',
            model: 'status'
        },

        'OPTIONS /statuses': {
            controller: 'Options',
            model: 'status',
            action: 'collection'
        },
        'OPTIONS /statuses/first': {
            controller: 'Options',
            model: 'status',
            action: 'query'
        },
        'OPTIONS /statuses/last': {
            controller: 'Options',
            model: 'status',
            action: 'query'
        },
        'OPTIONS /statuses/count': {
            controller: 'Options',
            model: 'status',
            action: 'count'
        },
        'OPTIONS /statuses/:id': {
            controller: 'Options',
            model: 'status',
            action: 'instance'
        },

        // Filetypes

        'GET /filetypes/statistics': {
            blueprint: 'statistics',
            model: 'filetype'
        },

        'DELETE /filetypes/:id': {
            controller: 'Delete',
            model: 'filetype',
            action: 'delete',
            policy: 'isAuthenticated'
        },
        'POST /filetypes/:id/restore': {
            controller: 'Delete',
            model: 'filetype',
            action: 'restore',
            policy: 'isAuthenticated'
        },
        'GET /filetypes/first': {
            blueprint: 'first',
            model: 'filetype'
        },
        'GET /filetypes/last': {
            blueprint: 'last',
            model: 'filetype'
        },
        'GET /filetypes/search': {
            blueprint: 'search',
            model: 'filetype'
        },
        'PATCH /filetypes/:id': {
            blueprint: 'update',
            model: 'filetype',
            policy: 'isAuthenticated'
        },
        'HEAD /filetypes/*': {
            controller: 'Head',
            action: 'Head',
            model: 'filetype'
        },
        'HEAD /filetypes': {
            controller: 'Head',
            action: 'Head',
            model: 'filetype'
        },

        'OPTIONS /filetypes': {
            controller: 'Options',
            model: 'filetype',
            action: 'collection'
        },
        'OPTIONS /filetypes/first': {
            controller: 'Options',
            model: 'filetype',
            action: 'query'
        },
        'OPTIONS /filetypes/last': {
            controller: 'Options',
            model: 'filetype',
            action: 'query'
        },
        'OPTIONS /filetypes/count': {
            controller: 'Options',
            model: 'filetype',
            action: 'count'
        },
        'OPTIONS /filetypes/:id': {
            controller: 'Options',
            model: 'filetype',
            action: 'instance'
        },

        // Files
        'PATCH /files/:id/publish': {
            controller: 'File',
            model: 'file',
            action: 'publish',
            policy: 'isAuthenticated'
        },
        'PATCH /files/:id/unpublish': {
            controller: 'File',
            model: 'file',
            action: 'unpublish',
            policy: 'isAuthenticated'
        },

        'GET /files/statistics': {
            blueprint: 'statistics',
            model: 'file'
        },

        'GET /files/:id/resources': 'File.resources',

        'GET /files/:id/download': 'File.download',

        'GET /files/:id/download/:format': 'File.formattedDownload',

        'DELETE /files': {
            controller: 'NotImplemented',
            model: 'file',
            action: 'notImplemented'
        },

        'PATCH /files': {
            controller: 'NotImplemented',
            model: 'file',
            action: 'notImplemented'
        },
        'PUT /files': {
            controller: 'NotImplemented',
            model: 'file',
            action: 'notImplemented'
        },

        'POST /files': {
            controller: 'File',
            model: 'file',
            action: 'create',
            policy: 'isAuthenticated'
        },

        'PATCH /files/:id': {
            controller: 'File',
            model: 'file',
            action: 'update',
            policy: 'isAuthenticated'
        },

        'GET /files/:id/contents': 'File.contents',

        'GET /files/first': {
            blueprint: 'first',
            model: 'file'
        },
        'GET /files/search': {
            blueprint: 'search',
            model: 'file'
        },
        'GET /files/last': {
            blueprint: 'last',
            model: 'file'
        },
        'HEAD /files/*': {
            controller: 'Head',
            action: 'Head',
            model: 'file'
        },
        'HEAD /files': {
            controller: 'Head',
            action: 'Head',
            model: 'file'
        },

        'OPTIONS /files': {
            controller: 'Options',
            model: 'file',
            action: 'collection'
        },
        'OPTIONS /files/first': {
            controller: 'Options',
            model: 'file',
            action: 'query'
        },
        'OPTIONS /files/last': {
            controller: 'Options',
            model: 'file',
            action: 'query'
        },
        'OPTIONS /files/count': {
            controller: 'Options',
            model: 'file',
            action: 'count'
        },
        'OPTIONS /files/:id': {
            controller: 'Options',
            model: 'file',
            action: 'instance'
        },

        // Databases

        'GET /databases/statistics': {
            blueprint: 'statistics',
            model: 'database'
        },

        'GET /databases/first': {
            blueprint: 'first',
            model: 'database'
        },
        'GET /databases/last': {
            blueprint: 'last',
            model: 'database'
        },
        'GET /databases/search': {
            blueprint: 'search',
            model: 'database'
        },
        'PATCH /databases/:id': {
            blueprint: 'update',
            model: 'database',
            policy: 'isAuthenticated'
        },
        'HEAD /databases/*': {
            controller: 'Head',
            action: 'Head',
            model: 'database'
        },
        'HEAD /databases': {
            controller: 'Head',
            action: 'Head',
            model: 'database'
        },

        'OPTIONS /databases': {
            controller: 'Options',
            model: 'database',
            action: 'collection'
        },
        'OPTIONS /databases/first': {
            controller: 'Options',
            model: 'database',
            action: 'query'
        },
        'OPTIONS /databases/last': {
            controller: 'Options',
            model: 'database',
            action: 'query'
        },
        'OPTIONS /databases/count': {
            controller: 'Options',
            model: 'database',
            action: 'count'
        },
        'OPTIONS /databases/:id': {
            controller: 'Options',
            model: 'database',
            action: 'instance'
        },


        // Datasets

        'PATCH /datasets/:id/publish': {
            controller: 'Dataset',
            model: 'dataset',
            action: 'publish',
            policy: 'isAuthenticated'
        },
        'PATCH /datasets/:id/unpublish': {
            controller: 'Dataset',
            model: 'dataset',
            action: 'unpublish',
            policy: 'isAuthenticated'
        },

        'GET /datasets/statistics': {
            blueprint: 'statistics',
            model: 'dataset'
        },

        'OPTIONS /datasets/statistics': {
            controller: 'Options',
            model: 'dataset',
            action: 'custom'
        },

        'DELETE /datasets': {
            controller: 'NotImplemented',
            model: 'dataset',
            action: 'notImplemented'
        },

        'PATCH /datasets': {
            controller: 'NotImplemented',
            model: 'dataset',
            action: 'notImplemented'
        },
        'PUT /datasets': {
            controller: 'NotImplemented',
            model: 'dataset',
            action: 'notImplemented'
        },


        'GET /datasets/:id/download': 'Dataset.download',
        'GET /datasets/feed/rss': 'Dataset.feedRss',
        'GET /datasets/first': {
            blueprint: 'first',
            model: 'dataset'
        },
        'GET /datasets/last': {
            blueprint: 'last',
            model: 'dataset'
        },
        'GET /datasets/search': {
            blueprint: 'search',
            model: 'dataset'
        },
        'OPTIONS /datasets/search': {
            controller: 'Options',
            model: 'dataset',
            action: 'custom'
        },
        'PATCH /datasets/:id': {
            blueprint: 'update',
            model: 'dataset',
            policy: 'isAuthenticated'
        },

        'HEAD /datasets/*': {
            controller: 'Head',
            action: 'Head',
            model: 'dataset'
        },
        'HEAD /datasets': {
            controller: 'Head',
            action: 'Head',
            model: 'dataset'
        },

        'OPTIONS /datasets': {
            controller: 'Options',
            model: 'dataset',
            action: 'collection'
        },
        'OPTIONS /datasets/first': {
            controller: 'Options',
            model: 'dataset',
            action: 'query'
        },
        'OPTIONS /datasets/last': {
            controller: 'Options',
            model: 'dataset',
            action: 'query'
        },
        'OPTIONS /datasets/count': {
            controller: 'Options',
            model: 'dataset',
            action: 'count'
        },
        'OPTIONS /datasets/:id': {
            controller: 'Options',
            model: 'dataset',
            action: 'instance'
        },


        // Tags

        'GET /tags/statistics': {
            blueprint: 'statistics',
            model: 'tag'
        },

        'DELETE /tags/:id': {
            controller: 'Delete',
            model: 'tag',
            action: 'delete',
            policy: 'isAuthenticated'
        },
        'POST /tags/:id/restore': {
            controller: 'Delete',
            model: 'tag',
            action: 'restore',
            policy: 'isAuthenticated'
        },
        'GET /tags/first': {
            blueprint: 'first',
            model: 'tag'
        },

        'GET /tags/last': {
            blueprint: 'last',
            model: 'tag'
        },
        'GET /tags/search': {
            blueprint: 'search',
            model: 'tag'
        },

        'PATCH /tags/:id': {
            blueprint: 'update',
            model: 'tag',
            policy: 'isAuthenticated'
        },
        'HEAD /tags/*': {
            controller: 'Head',
            action: 'Head',
            model: 'tag'
        },
        'HEAD /tags': {
            controller: 'Head',
            action: 'Head',
            model: 'tag'
        },

        'OPTIONS /tags': {
            controller: 'Options',
            model: 'tag',
            action: 'collection'
        },
        'OPTIONS /tags/first': {
            controller: 'Options',
            model: 'tag',
            action: 'query'
        },
        'OPTIONS /tags/last': {
            controller: 'Options',
            model: 'tag',
            action: 'query'
        },
        'OPTIONS /tags/count': {
            controller: 'Options',
            model: 'tag',
            action: 'count'
        },
        'OPTIONS /tags/:id': {
            controller: 'Options',
            model: 'tag',
            action: 'instance'
        },

        // UpdateFrequencies

        'GET /updatefrequencies/statistics': {
            blueprint: 'statistics',
            model: 'updatefrequency'
        },

        'GET /updatefrequencies/first': {
            blueprint: 'first',
            model: 'updatefrequency'
        },
        'GET /updatefrequencies/search': {
            blueprint: 'search',
            model: 'updatefrequency'
        },
        'GET /updatefrequencies/last': {
            blueprint: 'last',
            model: 'updatefrequency'
        },

        'PATCH /updatefrequencies/:id': {
            blueprint: 'update',
            model: 'updatefrequency',
            policy: 'isAuthenticated'
        },
        'HEAD /updatefrequencies/*': {
            controller: 'Head',
            action: 'Head',
            model: 'updatefrequency'
        },
        'HEAD /updatefrequencies': {
            controller: 'Head',
            action: 'Head',
            model: 'updatefrequency'
        },

        'OPTIONS /updatefrequencies': {
            controller: 'Options',
            model: 'updatefrequency',
            action: 'collection'
        },
        'OPTIONS /updatefrequencies/first': {
            controller: 'Options',
            model: 'updatefrequency',
            action: 'query'
        },
        'OPTIONS /updatefrequencies/last': {
            controller: 'Options',
            model: 'updatefrequency',
            action: 'query'
        },
        'OPTIONS /updatefrequencies/count': {
            controller: 'Options',
            model: 'updatefrequency',
            action: 'count'
        },
        'OPTIONS /updatefrequencies/:id': {
            controller: 'Options',
            model: 'updatefrequency',
            action: 'instance'
        },

        // Configs
        'GET /configs/statistics': {
            blueprint: 'statistics',
            model: 'config'
        },
        'GET /configs/first': {
            blueprint: 'first',
            model: 'config'
        },
        'GET /configs/last': {
            blueprint: 'last',
            model: 'config'
        },
        'GET /configs/search': {
            blueprint: 'search',
            model: 'config'
        },

        'PATCH /configs/:id': {
            blueprint: 'update',
            model: 'config',
            policy: 'isAuthenticated'
        },
        'HEAD /configs/*': {
            controller: 'Head',
            action: 'Head',
            model: 'config'
        },
        'HEAD /configs': {
            controller: 'Head',
            action: 'Head',
            model: 'config'
        },

        'OPTIONS /configs': {
            controller: 'Options',
            model: 'config',
            action: 'collection'
        },
        'OPTIONS /configs/first': {
            controller: 'Options',
            model: 'config',
            action: 'query'
        },
        'OPTIONS /configs/last': {
            controller: 'Options',
            model: 'config',
            action: 'query'
        },
        'OPTIONS /configs/count': {
            controller: 'Options',
            model: 'config',
            action: 'count'
        },
        'OPTIONS /configs/:id': {
            controller: 'Options',
            model: 'config',
            action: 'instance'
        },

        // Logs

        'GET /logs/statistics': {
            blueprint: 'statistics',
            model: 'log'
        },
        'GET /logs/first': {
            blueprint: 'first',
            model: 'log'
        },
        'GET /logs/last': {
            blueprint: 'last',
            model: 'log'
        },
        'GET /logs/search': {
            blueprint: 'search',
            model: 'log'
        },

        'HEAD /logs/*': {
            controller: 'Head',
            action: 'Head',
            model: 'log'
        },
        'HEAD /logs': {
            controller: 'Head',
            action: 'Head',
            model: 'log'
        },

        'OPTIONS /logs': {
            controller: 'Options',
            model: 'log',
            action: 'collection'
        },
        'OPTIONS /logs/first': {
            controller: 'Options',
            model: 'log',
            action: 'query'
        },
        'OPTIONS /logs/last': {
            controller: 'Options',
            model: 'log',
            action: 'query'
        },
        'OPTIONS /logs/count': {
            controller: 'Options',
            model: 'log',
            action: 'count'
        },
        'OPTIONS /logs/:id': {
            controller: 'Options',
            model: 'log',
            action: 'instance'
        },

        // Maps
        'PATCH /maps/:id/publish': {
            controller: 'Map',
            model: 'map',
            action: 'publish',
            policy: 'isAuthenticated'
        },
        'PATCH /maps/:id/unpublish': {
            controller: 'Map',
            model: 'map',
            action: 'unpublish',
            policy: 'isAuthenticated'
        },

        'GET /maps/statistics': {
            blueprint: 'statistics',
            model: 'map'
        },
        'DELETE /maps': {
            controller: 'NotImplemented',
            model: 'map',
            action: 'notImplemented'
        },

        'PATCH /maps': {
            controller: 'NotImplemented',
            model: 'map',
            action: 'notImplemented'
        },
        'PUT /maps': {
            controller: 'NotImplemented',
            model: 'map',
            action: 'notImplemented'
        },


        'GET /maps/first': {
            blueprint: 'first',
            model: 'map'
        },
        'GET /maps/last': {
            blueprint: 'last',
            model: 'map'
        },
        'GET /maps/search': {
            blueprint: 'search',
            model: 'map'
        },

        'PATCH /maps/:id': {
            controller: 'Map',
            model: 'map',
            action: 'update',
            policy: 'isAuthenticated'
        },

        'HEAD /maps/*': {
            controller: 'Head',
            action: 'Head',
            model: 'map'
        },
        'HEAD /maps': {
            controller: 'Head',
            action: 'Head',
            model: 'map'
        },

        'OPTIONS /maps': {
            controller: 'Options',
            model: 'map',
            action: 'collection'
        },
        'OPTIONS /maps/first': {
            controller: 'Options',
            model: 'map',
            action: 'query'
        },
        'OPTIONS /maps/last': {
            controller: 'Options',
            model: 'map',
            action: 'query'
        },
        'OPTIONS /maps/count': {
            controller: 'Options',
            model: 'map',
            action: 'count'
        },

        'OPTIONS /maps/:id': {
            controller: 'Options',
            model: 'map',
            action: 'instance'
        },

        // Charts
        'PATCH /charts/:id/publish': {
            controller: 'Chart',
            model: 'chart',
            action: 'publish',
            policy: 'isAuthenticated'

        },
        'PATCH /charts/:id/unpublish': {
            controller: 'Chart',
            model: 'chart',
            action: 'unpublish',
            policy: 'isAuthenticated'

        },

        'GET /charts/statistics': {
            blueprint: 'statistics',
            model: 'chart'
        },

        'POST /charts': {
            controller: 'Chart',
            model: 'chart',
            action: 'create',
            policy: 'isAuthenticated'

        },

        'DELETE /charts': {
            controller: 'NotImplemented',
            model: 'chart',
            action: 'notImplemented'
        },

        'PATCH /charts': {
            controller: 'NotImplemented',
            model: 'chart',
            action: 'notImplemented'
        },
        'PUT /charts': {
            controller: 'NotImplemented',
            model: 'chart',
            action: 'notImplemented'
        },


        'GET /charts/first': {
            blueprint: 'first',
            model: 'chart'
        },
        'GET /charts/last': {
            blueprint: 'last',
            model: 'chart'
        },
        'GET /charts/search': {
            blueprint: 'search',
            model: 'chart'
        },
        'PATCH /charts/:id': {
            controller: 'Chart',
            model: 'chart',
            action: 'update',
            policy: 'isAuthenticated'
        },

        'HEAD /charts/*': {
            controller: 'Head',
            action: 'Head',
            model: 'chart'
        },
        'HEAD /charts': {
            controller: 'Head',
            action: 'Head',
            model: 'chart'
        },

        'OPTIONS /charts': {
            controller: 'Options',
            model: 'chart',
            action: 'collection'
        },
        'OPTIONS /charts/first': {
            controller: 'Options',
            model: 'chart',
            action: 'query'
        },
        'OPTIONS /charts/last': {
            controller: 'Options',
            model: 'chart',
            action: 'query'
        },
        'OPTIONS /charts/count': {
            controller: 'Options',
            model: 'chart',
            action: 'count'
        },
        'OPTIONS /charts/:id': {
            controller: 'Options',
            model: 'chart',
            action: 'instance'
        },

        // Views

        'GET /views/statistics': {
            blueprint: 'statistics',
            model: 'view'
        },
        'DELETE /views': {
            controller: 'NotImplemented',
            model: 'view',
            action: 'notImplemented'
        },

        'PATCH /views': {
            controller: 'NotImplemented',
            model: 'view',
            action: 'notImplemented'
        },
        'PUT /views': {
            controller: 'NotImplemented',
            model: 'view',
            action: 'notImplemented'
        },


        'GET /views/first': {
            blueprint: 'first',
            model: 'view'
        },
        'GET /views/last': {
            blueprint: 'last',
            model: 'view'
        },
        'GET /views/search': {
            blueprint: 'search',
            model: 'view'
        },
        'PATCH /views/:id': {
            blueprint: 'update',
            model: 'view',
            policy: 'isAuthenticated'
        },

        'HEAD /views/*': {
            controller: 'Head',
            action: 'Head',
            model: 'view'
        },
        'HEAD /views': {
            controller: 'Head',
            action: 'Head',
            model: 'view'
        },

        'OPTIONS /views': {
            controller: 'Options',
            model: 'view',
            action: 'collection'
        },
        'OPTIONS /views/first': {
            controller: 'Options',
            model: 'view',
            action: 'query'
        },
        'OPTIONS /views/last': {
            controller: 'Options',
            model: 'view',
            action: 'query'
        },
        'OPTIONS /views/count': {
            controller: 'Options',
            model: 'view',
            action: 'count'
        },
        'OPTIONS /views/:id': {
            controller: 'Options',
            model: 'view',
            action: 'instance'
        },

        // Statistics

        'POST /statistics': {
            controller: 'NotImplemented',
            model: 'statistic',
            action: 'notImplemented'
        },

        'DELETE /statistics': {
            controller: 'NotImplemented',
            model: 'statistic',
            action: 'notImplemented'
        },

        'PATCH /statistics': {
            controller: 'NotImplemented',
            model: 'statistic',
            action: 'notImplemented'
        },
        'PUT /statistics': {
            controller: 'NotImplemented',
            model: 'statistic',
            action: 'notImplemented'
        },


        'GET /statistics/first': {
            blueprint: 'first',
            model: 'statistic'
        },
        'GET /statistics/last': {
            blueprint: 'last',
            model: 'statistic'
        },

        'HEAD /statistics/*': {
            controller: 'Head',
            action: 'Head',
            model: 'statistic'
        },
        'HEAD /statistics': {
            controller: 'Head',
            action: 'Head',
            model: 'statistic'
        },

        'OPTIONS /statistics': {
            controller: 'Options',
            model: 'statistic',
            action: 'collection'
        },
        'OPTIONS /statistics/first': {
            controller: 'Options',
            model: 'statistic',
            action: 'query'
        },
        'OPTIONS /statistics/last': {
            controller: 'Options',
            model: 'statistic',
            action: 'query'
        },
        'OPTIONS /statistics/count': {
            controller: 'Options',
            model: 'statistic',
            action: 'count'
        },
        'OPTIONS /statistics/:id': {
            controller: 'Options',
            model: 'statistic',
            action: 'instance'
        },

        // Basemaps

        'GET /basemaps/statistics': {
            blueprint: 'statistics',
            model: 'basemap'
        },
        'DELETE /basemaps': {
            controller: 'NotImplemented',
            model: 'basemap',
            action: 'notImplemented'
        },

        'PATCH /basemaps': {
            controller: 'NotImplemented',
            model: 'basemap',
            action: 'notImplemented'
        },
        'PUT /basemaps': {
            controller: 'NotImplemented',
            model: 'basemap',
            action: 'notImplemented'
        },

        'DELETE /basemaps/:id': {
            controller: 'Delete',
            model: 'basemap',
            action: 'delete',
            policy: 'isAuthenticated'
        },

        'GET /basemaps/first': {
            blueprint: 'first',
            model: 'basemap'
        },
        'GET /basemaps/last': {
            blueprint: 'last',
            model: 'basemap'
        },
        'GET /basemaps/search': {
            blueprint: 'search',
            model: 'basemap'
        },
        'PATCH /basemaps/:id': {
            blueprint: 'update',
            model: 'basemap',
            policy: 'isAuthenticated'
        },

        'HEAD /basemaps/*': {
            controller: 'Head',
            action: 'Head',
            model: 'basemap'
        },
        'HEAD /basemaps': {
            controller: 'Head',
            action: 'Head',
            model: 'basemap'
        },

        'OPTIONS /basemaps': {
            controller: 'Options',
            model: 'basemap',
            action: 'collection'
        },
        'OPTIONS /basemaps/first': {
            controller: 'Options',
            model: 'basemap',
            action: 'query'
        },
        'OPTIONS /basemaps/last': {
            controller: 'Options',
            model: 'basemap',
            action: 'query'
        },
        'OPTIONS /basemaps/count': {
            controller: 'Options',
            model: 'basemap',
            action: 'count'
        },
        'OPTIONS /basemaps/:id': {
            controller: 'Options',
            model: 'basemap',
            action: 'instance'
        }
    }
};
