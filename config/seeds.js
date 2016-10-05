module.exports = {
    fixtures: {
        order: [
            'User', 'Status', 'FileType', 'Config', 'UpdateFrequency', 'Basemap'
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
            organization: 'eWRhpRV'
        }],

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
            mimetype: 'text/csv',
            api: true
        }, {
            id: 'tWRhpRV',
            name: 'html',
            mimetype: 'text/html',
            api: false
        }, {
            id: 'uWRhpRV',
            name: 'ics',
            mimetype: 'text/calendar',
            api: false
        }, {
            id: 'vWRhpRV',
            name: 'pdf',
            mimetype: 'application/pdf',
            api: false
        }, {
            id: 'wWRhpRV',
            name: 'rar',
            mimetype: 'application/x-rar-compressed',
            api: false
        }, {
            id: 'xWRhpRV',
            name: 'shp',
            mimetype: 'application/octet-stream',
            api: false
        }, {
            id: 'yWRhpRV',
            name: 'xls',
            mimetype: 'application/xls',
            api: true
        }, {
            id: '1WRhpRV',
            name: 'xlsx',
            mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            api: true
        }, {
            id: '2WRhpRV',
            name: 'application-xml',
            mimetype: 'application/xml',
            api: false
        }, {
            id: '3WRhpRV',
            name: 'text-xml',
            mimetype: 'text/xml',
            api: false
        }, {
            id: '4WRhpRV',
            name: 'ms-excel',
            mimetype: 'application/vnd.ms-excel',
            api: true
        }, {
            id: '5WRhpRV',
            name: 'zip',
            mimetype: 'application/zip',
            api: false
        }, {
            id: '6WRhpRV',
            name: 'zip-compressed',
            mimetype: 'application/x-zip-compressed',
            api: false
        }, {
            id: '8WRhpRV',
            name: 'excel',
            mimetype: 'application/vnd.ms-excel',
            api: true
        }, {
            id: '7WRhpRV',
            name: 'xml2',
            mimetype: 'text/xml',
            api: false
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
            value: 'sWRhpRV',
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
        }]

    }
};