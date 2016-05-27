"use strict";

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

module.exports = {
    routes: {

        // Users

        'POST /users/login': 'User.login', // LOGOUT missing!!!
        'GET /users/refreshToken': 'User.refreshToken',

        'GET /users/first': {blueprint: 'first', model: 'user'},

        'GET /users/last': {blueprint: 'last', model: 'user'},

        'PATCH /users/:id': {blueprint: 'update', model: 'user'},

        'OPTIONS /users': {controller: 'Options', model: 'user', action: 'collection'},

        'HEAD /users/*': {controller: 'Head', action: 'Head', model: 'user'},
        'HEAD /users': {controller: 'Head', action: 'Head', model: 'user'},

        // Organizations

        'GET /organizations/first': {
            blueprint: 'first',
            model: 'organization'
        },

        'GET /organizations/last': {
            blueprint: 'last',
            model: 'organization'
        },

        'PATCH /organizations/:id': {
            blueprint: 'update',
            model: 'organization'
        },
        'HEAD /organizations/*': {controller: 'Head', action: 'Head', model: 'organization'},
        'HEAD /organizations': {controller: 'Head', action: 'Head', model: 'organization'},

        'OPTIONS /organizations': {controller: 'Options', model: 'organization', action: 'collection'},


        // Categories

        'GET /categories/first': {
            blueprint: 'first',
            model: 'category'
        },
        'GET /categories/last': {
            blueprint: 'last',
            model: 'category'
        },
        'PATCH /categories/:id': {
            blueprint: 'update',
            model: 'category'
        },
        'HEAD /categories/*': {controller: 'Head', action: 'Head', model: 'category'},
        'HEAD /categories': {controller: 'Head', action: 'Head', model: 'category'},

        'OPTIONS /categories': {controller: 'Options', model: 'category', action: 'collection'},
        // 'OPTIONS /categories/:id': { blueprinst: 'update', model: 'category' },


        // Statuses

        'GET /statuses/first': {
            blueprint: 'first',
            model: 'status'
        },
        'GET /statuses/last': {
            blueprint: 'last',
            model: 'status'
        },
        'PATCH /statuses/:id': {
            blueprint: 'update',
            model: 'status'
        },
        'HEAD /statuses/*': {controller: 'Head', action: 'Head', model: 'status'},
        'HEAD /statuses': {controller: 'Head', action: 'Head', model: 'status'},

        'OPTIONS /statuses': {controller: 'Options', model: 'status', action: 'collection'},

        // 'OPTIONS /statuses/:id': { blueprinst: 'update', model: 'status' },


        // Filetypes

        'GET /filetypes/first': {
            blueprint: 'first',
            model: 'filetype'
        },
        'GET /filetypes/last': {
            blueprint: 'last',
            model: 'filetype'
        },
        'PATCH /filetypes/:id': {
            blueprint: 'update',
            model: 'filetype'
        },
        'HEAD /filetypes/*': {controller: 'Head', action: 'Head', model: 'filetype'},
        'HEAD /filetypes': {controller: 'Head', action: 'Head', model: 'filetype'},

        'OPTIONS /filetypes': {controller: 'Options', model: 'filetype', action: 'collection'},


        // Files

        'GET /files/first': {
            blueprint: 'first',
            model: 'file'
        },

        'GET /files/last': {
            blueprint: 'last',
            model: 'file'
        },
        'PATCH /files/:id': {
            blueprint: 'update',
            model: 'file'
        },
        'HEAD /files/*': {controller: 'Head', action: 'Head', model: 'file'},
        'HEAD /files': {controller: 'Head', action: 'Head', model: 'file'},

        'OPTIONS /files': {controller: 'Options', model: 'file', action: 'collection'},


        // Databases

        'GET /databases/first': {
            blueprint: 'first',
            model: 'database'
        },
        'GET /databases/last': {
            blueprint: 'last',
            model: 'database'
        },
        'PATCH /databases/:id': {
            blueprint: 'update',
            model: 'database'
        },
        'HEAD /databases/*': {controller: 'Head', action: 'Head', model: 'database'},
        'HEAD /databases': {controller: 'Head', action: 'Head', model: 'database'},

        'OPTIONS /databases': {controller: 'Options', model: 'database', action: 'collection'},


        // Files

        'POST /files/upload': 'File.upload',
        'GET /files/download/:filename': 'File.download',


        // Datasets


        'GET /datasets/first': {
            blueprint: 'first',
            model: 'dataset'
        },
        'GET /datasets/last': {
            blueprint: 'last',
            model: 'dataset'
        },
        'PATCH /datasets/:id': {
            blueprint: 'update',
            model: 'dataset'
        },
        'HEAD /datasets/*': {controller: 'Head', action: 'Head', model: 'dataset'},
        'HEAD /datasets': {controller: 'Head', action: 'Head', model: 'dataset'},

        'OPTIONS /datasets': {controller: 'Options', model: 'dataset', action: 'collection'},

        // Tags

        'GET /tags/first': {
            blueprint: 'first',
            model: 'tag'
        },

        'GET /tags/last': {
            blueprint: 'last',
            model: 'tag'
        },

        'PATCH /tags/:id': {
            blueprint: 'update',
            model: 'tag'
        },
        'HEAD /tags/*': {controller: 'Head', action: 'Head', model: 'tag'},
        'HEAD /tags': {controller: 'Head', action: 'Head', model: 'tag'},

        'OPTIONS /tags': {controller: 'Options', model: 'tag', action: 'collection'},

        // UpdateFrequencies

        'GET /updatefrequencies/first': {
            blueprint: 'first',
            model: 'updatefrequency'
        },

        'GET /updatefrequencies/last': {
            blueprint: 'last',
            model: 'updatefrequency'
        },

        'PATCH /updatefrequencies/:id': {
            blueprint: 'update',
            model: 'updatefrequency'
        },
        'HEAD /updatedfrequencies/*': {controller: 'Head', action: 'Head', model: 'updatefrequency'},
        'HEAD /updatedfrequencies': {controller: 'Head', action: 'Head', model: 'updatefrequency'},

        'OPTIONS /updatedfrequencies': {controller: 'Options', model: 'updatefrequency', action: 'collection'},
        // Configs

        'GET /configs/first': {
            blueprint: 'first',
            model: 'config'
        },

        'GET /configs/last': {
            blueprint: 'last',
            model: 'config'
        },

        'PATCH /configs/:id': {
            blueprint: 'update',
            model: 'config'
        },
        'HEAD /configs/*': {controller: 'Head', action: 'Head', model: 'config'},
        'HEAD /configs': {controller: 'Head', action: 'Head', model: 'config'},

        'OPTIONS /configs': {controller: 'Options', model: 'config', action: 'collection'},
    }
};
