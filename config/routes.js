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
        'OPTIONS /users/:id': {controller: 'Options', model: 'user', action: 'instance'},
        'OPTIONS /users/first': {controller: 'Options', model: 'user', action: 'query'},
        'OPTIONS /users/last': {controller: 'Options', model: 'user', action: 'query'},
        'OPTIONS /users/count': {controller: 'Options', model: 'user', action: 'query'},

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
        'OPTIONS /organizations/:id': {controller: 'Options', model: 'organization', action: 'instance'},
        'OPTIONS /organizations/first': {controller: 'Options', model: 'organization', action: 'query'},
        'OPTIONS /organizations/last': {controller: 'Options', model: 'organization', action: 'query'},
        'OPTIONS /organizations/count': {controller: 'Options', model: 'organization', action: 'query'},


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
        'OPTIONS /categories/:id': {controller: 'Options', model: 'category', action: 'instance'},
        'OPTIONS /categories/first': {controller: 'Options', model: 'category', action: 'query'},
        'OPTIONS /categories/last': {controller: 'Options', model: 'category', action: 'query'},
        'OPTIONS /categories/count': {controller: 'Options', model: 'category', action: 'query'},


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
        'OPTIONS /statuses/:id': {controller: 'Options', model: 'status', action: 'instance'},
        'OPTIONS /statuses/first': {controller: 'Options', model: 'status', action: 'query'},
        'OPTIONS /statuses/last': {controller: 'Options', model: 'status', action: 'query'},
        'OPTIONS /statuses/count': {controller: 'Options', model: 'status', action: 'query'},

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
        'OPTIONS /filetypes/:id': {controller: 'Options', model: 'filetype', action: 'instance'},
        'OPTIONS /filetypes/first': {controller: 'Options', model: 'filetype', action: 'query'},
        'OPTIONS /filetypes/last': {controller: 'Options', model: 'filetype', action: 'query'},
        'OPTIONS /filetypes/count': {controller: 'Options', model: 'filetype', action: 'query'},


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
        'OPTIONS /files/:id': {controller: 'Options', model: 'file', action: 'instance'},
        'OPTIONS /files/first': {controller: 'Options', model: 'file', action: 'query'},
        'OPTIONS /files/last': {controller: 'Options', model: 'file', action: 'query'},
        'OPTIONS /files/count': {controller: 'Options', model: 'file', action: 'query'},


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
        'OPTIONS /databases/:id': {controller: 'Options', model: 'database', action: 'instance'},
        'OPTIONS /databases/first': {controller: 'Options', model: 'database', action: 'query'},
        'OPTIONS /databases/last': {controller: 'Options', model: 'database', action: 'query'},
        'OPTIONS /databases/count': {controller: 'Options', model: 'database', action: 'query'},


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
        'OPTIONS /datasets/:id': {controller: 'Options', model: 'dataset', action: 'instance'},
        'OPTIONS /datasets/first': {controller: 'Options', model: 'dataset', action: 'query'},
        'OPTIONS /datasets/last': {controller: 'Options', model: 'dataset', action: 'query'},
        'OPTIONS /datasets/count': {controller: 'Options', model: 'dataset', action: 'query'},

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
        'OPTIONS /tags/:id': {controller: 'Options', model: 'tag', action: 'instance'},
        'OPTIONS /tags/first': {controller: 'Options', model: 'tag', action: 'query'},
        'OPTIONS /tags/last': {controller: 'Options', model: 'tag', action: 'query'},
        'OPTIONS /tags/count': {controller: 'Options', model: 'tag', action: 'query'},

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
        'OPTIONS /updatedfrequencies/:id': {controller: 'Options', model: 'updatefrequency', action: 'instance'},
        'OPTIONS /updatedfrequencies/first': {controller: 'Options', model: 'updatefrequency', action: 'query'},
        'OPTIONS /updatedfrequencies/last': {controller: 'Options', model: 'updatefrequency', action: 'query'},
        'OPTIONS /updatedfrequencies/count': {controller: 'Options', model: 'updatefrequency', action: 'query'},
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
        'OPTIONS /configs/:id': {controller: 'Options', model: 'config', action: 'instance'},
        'OPTIONS /configs/first': {controller: 'Options', model: 'config', action: 'query'},
        'OPTIONS /configs/last': {controller: 'Options', model: 'config', action: 'query'},
        'OPTIONS /configs/count': {controller: 'Options', model: 'config', action: 'query'},
    }
};
