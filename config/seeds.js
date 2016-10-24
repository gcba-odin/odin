const _ = require('lodash');
const PermissionService = require('../api/services/PermissionService');
const roles = PermissionService.roles;
const actions = PermissionService.actions;

module.exports = {
    fixtures: {
        order: [
            'User', 'PermissionRule','Status', 'FileType', 'Config', 'UpdateFrequency', 'Basemap'
        ],
        User: [{
            id: 'dogPzIz9',
            username: 'admin',
            password: '123',
            email: 'admin@super.com',
            firstName: 'The',
            lastName: 'Admin',
            active: true,
            createdBy: 'dogPzIz9',
            organization: 'eWRhpRV',
            role: 'superadmin'
        }],

        PermissionRule: _.flattenDeep([
            //Admin
            { role: roles.ADMIN, model: 'user', action: actions.READ },
            { role: roles.ADMIN, model: 'user', action: actions.UPDATE },
            { role: roles.ADMIN, model: 'config', action: actions.READ },
            _.map(['organization', 'dataset', 'file', 'restservice', 'soapservice', 'chart', 'map',
                'category', 'tag', 'updatefrequency', 'status', 'filetype', 'basemap', 'config'], (model) => [
                { role: roles.ADMIN, model: model, action: actions.CREATE },
                { role: roles.ADMIN, model: model, action: actions.UPDATE },
                { role: roles.ADMIN, model: model, action: actions.DESTROY },
                { role: roles.ADMIN, model: model, action: actions.DEACTIVATE },
                { role: roles.ADMIN, model: model, action: actions.RESTORE }
            ]),
            _.map(['dataset', 'file', 'chart', 'map'], (model) => [
                { role: roles.ADMIN, model: model, action: actions.PUBLISH },
                { role: roles.ADMIN, model: model, action: actions.UNPUBLISH }
            ]),

            //Guest
            _.map(['file', 'chart', 'map'], (model) => [
                { role: roles.GUEST, model: model, action: actions.CREATE },
                { role: roles.GUEST, model: model, action: actions.UPDATE, owner: true }
            ]),
            { role: roles.GUEST, model: 'tag', action: actions.CREATE }
        ]),

        Status: [{
            id: 'nWRhpRV',
            name: 'Borrador'
        }, {
            id: 'oWRhpRV',
            name: 'En revisión'
        }, {
            id: 'pWRhpRV',
            name: 'Rechazado'
        }, {
            id: 'qWRhpRV',
            name: 'Publicado'
        }, {
            id: 'rWRhpRV',
            name: 'Despublicado'
        }],
        FileType: [{
            id: 'sWRhpRV',
            name: 'csv',
            mimetype: ['text/csv', 'application/csv'],
            api: true,
            editable: false
        }, {
            id: 'tWRhpRV',
            name: 'html',
            mimetype: ['text/html'],
            api: false,
            editable: true
        }, {
            id: 'uWRhpRV',
            name: 'ics',
            mimetype: ['text/calendar'],
            api: false,
            editable: true
        }, {
            id: 'vWRhpRV',
            name: 'pdf',
            mimetype: ['application/pdf'],
            api: false,
            editable: false
        }, {
            id: 'wWRhpRV',
            name: 'rar',
            mimetype: ['application/x-rar-compressed'],
            api: false,
            editable: true
        }, {
            id: 'xWRhpRV',
            name: 'shp',
            mimetype: ['application/octet-stream'],
            api: false,
            editable: true
        }, {
            id: 'yWRhpRV',
            name: 'xls',
            mimetype: ['application/xls', 'application/vnd.ms-excel'],
            api: true,
            editable: false
        }, {
            id: '1WRhpRV',
            name: 'xlsx',
            mimetype: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
            api: true,
            editable: false
        }, {
            id: '2WRhpRV',
            name: 'xml',
            mimetype: ['application/xml', 'text/xml'],
            api: false,
            editable: true
        }, {
            id: '3WRhpRV',
            name: 'zip',
            mimetype: ['application/zip', 'application/x-zip-compressed'],
            api: false,
            editable: true
        }, {
            id: '9WRhpRV',
            name: 'json',
            mimetype: ['application/json'],
            api: true,
            editable: false
        }],
        UpdateFrequency: [{
            id: 'tWRhpR2',
            name: 'Eventual'
        }, {
            id: 'zWRhpR8',
            name: 'Bianual',
            timePattern: '0 0 0 1 1/1 * *'
        }, {
            id: 'sWRhpR1',
            name: 'Anual',
            timePattern: '0 0 0 1 1 * *'
        }, {
            id: 'wWRhpR5',
            name: 'Semestral',
            timePattern: '0 0 0 1 1/6 * *'
        }, {
            id: 'vWRhpR4',
            name: 'Trimestral',
            timePattern: '0 0 0 1 1/3 * *'
        }, {
            id: '0WRhpR9',
            name: 'Bimestral',
            timePattern: '0 0 0 1 1/2 * *'
        }, {
            id: 'uWRhpR3',
            name: 'Mensual',
            timePattern: '0 0 0 1 1/1 * *'
        }, {
            id: 'yWRhpR7',
            name: 'Semanal',
            timePattern: '0 0 0 * * 0 *'
        }, {
            id: 'xWRhpR6',
            name: 'Tiempo Real',
            timePattern: '0 */1 * * * *'
        }],

        Basemap: [{
            id: 'nYrnfYEv',
            name: 'roadmap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }],

        Config: [{
            id: '1ogPzIz9',
            description: 'Modelos logueados',
            type: 'model',
            multiple: true,
            key: 'logWhitelist',
            value: ['category', 'dataset', 'fileType', 'file',
                'organization', 'status', 'tag', 'updateFrequency', 'user'
            ],
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '0ogPzIz9',
            description: 'Estado por defecto',
            type: 'model',
            multiple: false,
            model: 'Statuses',
            key: 'defaultStatus',
            value: 'qWRhpRV',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '2ogPzIz9',
            description: 'Estado publicado',
            type: 'model',
            multiple: false,
            model: 'Statuses',
            key: 'publishedStatus',
            value: 'qWRhpRV',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '3ogPzIz9',
            description: 'Estado despublicado',
            type: 'model',
            multiple: false,
            model: 'Statuses',
            key: 'unpublishedStatus',
            value: 'rWRhpRV',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '4ogPzIz9',
            description: 'Estado rechazado',
            type: 'model',
            multiple: false,
            model: 'Statuses',
            key: 'rejectedStatus',
            value: 'pWRhpRV',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '5ogPzIz9',
            description: 'Paginación en frontend',
            type: 'integer',
            multiple: false,
            key: 'frontEndPagination',
            value: 50,
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '6ogPzIz9',
            description: 'Paginación en admin',
            type: 'integer',
            multiple: false,
            key: 'adminPagination',
            value: 20,
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '7ogPzIz9',
            description: 'Url base frontend',
            type: 'string',
            multiple: false,
            key: 'frontEndUrl',
            value: 'www.odinproject.org',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '8ogPzIz9',
            description: 'Limite de puntos para creación de mapa',
            type: 'integer',
            multiple: false,
            key: 'mapPointsLimit',
            value: 2000,
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '9ogPzIz9',
            description: 'Zoom maximo en la creacion de mapa base',
            type: 'integer',
            multiple: false,
            key: 'defaultMaxZoom',
            value: 18,
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'aogPzIz9',
            description: 'Zoom minimo en la creacion de mapa base',
            type: 'integer',
            multiple: false,
            key: 'defaultMinZoom',
            value: 0,
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'bogPzIz9',
            description: 'Organizacion por defecto',
            type: 'model',
            multiple: false,
            model: 'Organizations',
            key: 'defaultOrganization',
            value: '',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'cogPzIz9',
            description: 'Estado en revisión',
            type: 'model',
            multiple: false,
            model: 'Statuses',
            key: 'underReviewStatus',
            value: 'oWRhpRV',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }]
    }
};
