"use strict";

module.exports = {
    'GET /filetypes/statistics': {
        blueprint: 'statistics',
        model: 'filetype'
    },
    'DELETE /filetypes/:id': {
        controller: 'Destroy',
        model: 'filetype',
        action: 'destroy'
    },
    'POST /filetypes/:id/restore': {
        controller: 'Destroy',
        model: 'filetype',
        action: 'restore'
    },
    'POST /filetypes/:id/deactivate': {
        controller: 'Destroy',
        model: 'filetype',
        action: 'deactivate'
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
    // 'PATCH /filetypes/:id': {
    //     blueprint: 'update',
    //     model: 'filetype',
    //     policy: 'isAuthenticated'
    // },
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
    }
};
