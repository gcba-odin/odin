module.exports = {
    fixtures: {
        order: [
            'Organization', 'User', 'Category', 'Status', 'FileType', 'Config', 'UpdateFrequency',
            'Tag', 'Dataset', 'File', 'Chart', 'Basemap', 'Map', 'View', 'Log', 'Statistic'
        ],
        User: [{
            id: 'dogPzIz9',
            username: 'admin',
            password: '123',
            email: 'admin@super.com',
            firstName: 'The',
            lastName: 'Admin',
            avatar: 'http://i.imgur.com/cuKC0Us.jpg',
            active: true,
            createdBy: 'dogPzIz9',
            organization: 'eWRhpRV'
        }, {
            id: 'dogPzIz8',
            username: 'henrywagner',
            password: '123',
            email: 'hwagner0@merriam-webster.com',
            firstName: 'Henry',
            lastName: 'Wagner',
            avatar: 'http://i.imgur.com/cuKC0Us.jpg',
            active: true,
            createdBy: 'dogPzIz9',
            organization: 'eWRhpRV'
        }, {
            id: 'nYrnfYEv',
            username: 'howardfoster',
            password: '123',
            email: 'hfoster1@cbsnews.com',
            firstName: 'Howard',
            lastName: 'Foster',
            avatar: 'http://i.imgur.com/cuKC0Us.jpg',
            active: true,
            createdBy: 'dogPzIz9',
            organization: 'eWRhpRV'
        }, {
            id: 'a4vhAoFG',
            username: 'ashleychavez',
            password: '123',
            email: 'achavez2@go.com',
            firstName: 'Ashley',
            lastName: 'Chavez',
            avatar: 'http://i.imgur.com/cuKC0Us.jpg',
            active: true,
            createdBy: 'dogPzIz9',
            organization: 'eWRhpRV'
        }, {
            id: 'hwX6aOr7',
            username: 'melissafrazier',
            password: '123',
            email: 'mfrazier3@gizmodo.com',
            firstName: 'Melissa',
            lastName: 'Frazier',
            avatar: 'http://i.imgur.com/cuKC0Us.jpg',
            active: true,
            createdBy: 'dogPzIz9',
            organization: 'eWRhpRV'
        }, {
            id: 'eWRhpRV',
            username: 'petermorrison',
            password: '123',
            email: 'pmorrison4@wp.com',
            firstName: 'Peter',
            lastName: 'Morrison',
            avatar: 'http://i.imgur.com/cuKC0Us.jpg',
            active: true,
            createdBy: 'dogPzIz9',
            organization: 'eWRhpRV'
        }],
        Organization: [{
            id: 'eWRhpRV',
            name: 'ACME',
            description: 'An example organization.',
            address: 'Example Ave. 254',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9'
        }, {
            id: 'dWRhpRV',
            name: 'Umbrella Corp',
            description: 'An example organization.',
            address: 'Example Ave. 255',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9'
        }, {
            id: 'fWRhpRV',
            name: 'Star Labs',
            description: 'An example organization.',
            address: 'Example Ave. 256',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9'
        }, {
            id: 'gWRhpRV',
            name: 'Aperture Labs',
            description: 'An example organization.',
            address: 'Example Ave. 257',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9'
        }, {
            id: 'hWRhpRV',
            name: 'Oscorp',
            description: 'An example organization.',
            address: 'Example Ave. 258',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9'
        }],
        Category: [{
            id: 'iWRhpRV',
            name: 'Cultura, Recreación y Turismo',
            description: 'An example category.',
            active: true,
            color: 'F5B69E',
            image: 'http://svgur.com/i/9B.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'jWRhpRV',
            name: 'Economía, Negocio y Comercio',
            description: 'An example category.',
            active: true,
            color: 'FBCDB7',
            image: 'http://svgur.com/i/8e.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'kWRhpRV',
            name: 'Educación',
            description: 'An example category.',
            active: true,
            color: 'FFF4D2',
            image: 'http://svgur.com/i/7f.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'lWRhpRV',
            name: 'Gobierno y Administración Pública',
            description: 'An example category.',
            active: false,
            color: 'D4F1E6',
            image: 'http://svgur.com/i/7x.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'mWRhpRV',
            name: 'Medio Ambiente',
            description: 'An example category.',
            active: false,
            color: 'BFF0E7',
            image: 'http://svgur.com/i/7y.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'mWRhpR1',
            name: 'Salud',
            description: 'An example category.',
            active: false,
            color: 'F5B69E',
            image: 'http://svgur.com/i/8C.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'mWRhpR2',
            name: 'Seguridad',
            description: 'An example category.',
            active: false,
            color: 'FBCDB7',
            image: 'http://svgur.com/i/9N.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'mWRhpR3',
            name: 'Transporte',
            description: 'An example category.',
            active: false,
            color: 'FFF4D2',
            image: 'http://svgur.com/i/8Y.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'mWRhpR4',
            name: 'Urbanismo e Infraestructura',
            description: 'An example category.',
            active: false,
            color: 'D4F1E6',
            image: 'http://svgur.com/i/7K.svg',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
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
        Database: [{
            id: 'sWRhpRf',
            name: 'Database 1',
            collection: 'ExampleCollection',
            url: 'http://i.imgur.com/u7CUz6v.png'
        }, {
            id: 'sWRhpRg',
            name: 'Database 2',
            collection: 'ExampleCollection',
            url: 'http://i.imgur.com/u7CUz6v.png'
        }, {
            id: 'sWRhpRh',
            name: 'Database 3',
            collection: 'ExampleCollection',
            url: 'http://i.imgur.com/u7CUz6v.png'
        }, {
            id: 'sWRhpRi',
            name: 'Database 4',
            collection: 'ExampleCollection',
            url: 'http://i.imgur.com/u7CUz6v.png'
        }, {
            id: 'sWRhpRj',
            name: 'Database 5',
            collection: 'ExampleCollection',
            url: 'http://i.imgur.com/u7CUz6v.png'
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
            id: 'zWRhpRV',
            name: 'xml',
            mimetype: 'application/xml',
            api: false
        }, {
            id: '0WRhpRV',
            name: 'zip',
            mimetype: 'application/zip',
            api: false
        }],
        UpdateFrequency: [{
            id: 'tWRhpR2',
            name: 'Eventual'
        }, {
            id: 'zWRhpR8',
            name: 'Bianual'
        }, {
            id: 'sWRhpR1',
            name: 'Anual'
        }, {
            id: 'wWRhpR5',
            name: 'Semestral'
        }, {
            id: 'vWRhpR4',
            name: 'Trimestral'
        }, {
            id: '0WRhpR9',
            name: 'Bimestral'
        }, {
            id: 'uWRhpR3',
            name: 'Mensual'
        }, {
            id: 'yWRhpR7',
            name: 'Semanal'
        }, {
            id: 'xWRhpR6',
            name: 'Tiempo Real'
        }],
        Tag: [{
            id: 'tWRhpz2',
            name: 'Tag 1',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'uWRhpz2',
            name: 'Tag 2',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'vWRhpz2',
            name: 'Tag 3',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'wWRhpz2',
            name: 'Tag 4',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'xWRhpz2',
            name: 'Tag 5',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'yWRhpz2',
            name: 'Tag 6',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'zWRhpz2',
            name: 'Tag 7',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'aWRhpz1',
            name: 'Tag 8',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'bWRhpz2',
            name: 'Tag 9',
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }],
        Dataset: [{
            id: 'sWRhpRk',
            name: 'Dataset 1',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optionals: null,
            publishedAt: '2011-01-01 00:00:01+03',
            models: {
                status: {
                    name: 'Borrador'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                },
                category: {
                    name: ['Cultura, Recreación y Turismo', 'Economía, negocio y comercio']
                }
            }
        }, {
            id: 'sWRhpRl',
            name: 'Dataset 2',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optionals: null,
            publishedAt: '2011-01-01 00:00:02+03',
            models: {
                status: {
                    name: 'En revisión'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                },
                category: {
                    name: ['Cultura, Recreación y Turismo', 'Economía, negocio y comercio']
                }
            }
        }, {
            id: 'sWRhpRm',
            name: 'Dataset 3',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optionals: null,
            publishedAt: '2011-01-01 00:00:03+03',
            models: {
                status: {
                    name: 'Rechazado'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 7', 'Tag 8', 'Tag 9']
                },
                category: {
                    name: ['Cultura, Recreación y Turismo', 'Economía, negocio y comercio']
                }
            }
        }, {
            id: 'sWRhpRn',
            name: 'Dataset 4',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optionals: null,
            publishedAt: '2011-01-01 00:00:04+03',
            models: {
                status: {
                    name: 'Publicado'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                },
                category: {
                    name: ['Gobierno y administración pública', 'Economía, negocio y comercio']
                }
            }
        }, {
            id: 'sWRhpRo',
            name: 'Dataset 5',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optionals: null,
            publishedAt: '2011-01-01 00:00:05+03',
            models: {
                status: {
                    name: 'Despublicado'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                },
                category: {
                    name: ['Gobierno y administración pública', 'Economía, negocio y comercio', 'Medio ambiente']
                }
            }
        }],
        File: [{
            id: 'sWRhpRa',
            name: 'File 1',
            description: 'An example file.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/u7CUz6v.png',
            visible: 1,
            optionals: null,
            publishedAt: '2011-01-01 00:00:01+03',
            models: {
                type: {
                    name: 'csv'
                },
                status: {
                    name: 'Borrador'
                },
                organization: {
                    name: 'ACME'
                },
                dataset: {
                    name: 'Dataset 1'
                },
                updateFrequency: {
                    name: 'Eventual'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                }
            }
        }, {
            id: 'tWRhpRb',
            name: 'File 2',
            description: 'An example file.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/u7CUz6v.png',
            visible: 1,
            optionals: null,
            publishedAt: '2011-01-01 00:00:02+03',
            models: {
                type: {
                    name: 'html'
                },
                status: {
                    name: 'En revisión'
                },
                organization: {
                    name: 'Umbrella Corp'
                },
                dataset: {
                    name: 'Dataset 2'
                },
                updateFrequency: {
                    name: 'Anual'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                }
            }
        }, {
            id: 'uWRhpRc',
            name: 'File 3',
            description: 'An example file.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/u7CUz6v.png',
            visible: 1,
            optionals: null,
            publishedAt: '2011-01-01 00:00:03+03',
            models: {
                type: {
                    name: 'ics'
                },
                status: {
                    name: 'Rechazado'
                },
                organization: {
                    name: 'Oscorp'
                },
                dataset: {
                    name: 'Dataset 3'
                },
                updateFrequency: {
                    name: 'Mensual'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 7', 'Tag 8', 'Tag 9']
                }
            }
        }, {
            id: 'vWRhpRd',
            name: 'File 4',
            description: 'An example file.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/u7CUz6v.png',
            visible: 1,
            optionals: null,
            publishedAt: '2011-01-01 00:00:04+03',
            models: {
                type: {
                    name: 'rar'
                },
                status: {
                    name: 'Publicado'
                },
                organization: {
                    name: 'Aperture Labs'
                },
                dataset: {
                    name: 'Dataset 4'
                },
                updateFrequency: {
                    name: 'Semanal'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                }
            }
        }, {
            id: 'wWRhpRe',
            name: 'File 5',
            description: 'An example file.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/u7CUz6v.png',
            visible: 1,
            optionals: null,
            publishedAt: '2011-01-01 00:00:05+03',
            models: {
                type: {
                    name: 'pdf'
                },
                status: {
                    name: 'Despublicado'
                },
                organization: {
                    name: 'ACME'
                },
                dataset: {
                    name: 'Dataset 5'
                },
                updateFrequency: {
                    name: 'Trimestral'
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                }
            }
        }],
        Chart: [{
            id: '1ogPbIz9',
            name: 'Chart 1',
            description: 'An example chart.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/i2604rk.jpg',
            embedCode: "<div></div>",
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '2ogPbIz9',
            name: 'Chart 2',
            description: 'An example chart.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/i2604rk.jpg',
            embedCode: "<div></div>",
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '3ogPbIz9',
            name: 'Chart 3',
            description: 'An example chart.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/i2604rk.jpg',
            embedCode: "<div></div>",
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '4ogPbIz9',
            name: 'Chart 4',
            description: 'An example chart.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/i2604rk.jpg',
            embedCode: "<div></div>",
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '5ogPbIz9',
            name: 'Chart 5',
            description: 'An example chart.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/i2604rk.jpg',
            embedCode: "<div></div>",
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }],
        Basemap: [{
            id: 'nYrnfYEv',
            name: 'roadmap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }],
        Map: [{
            id: '6ogPbIz9',
            name: 'Map 1',
            description: 'An example map.',
            notes: 'Lorem ipsum dolor sit amet...',
            basemap: 'nYrnfYEv',
            url: 'http://i.imgur.com/ZjlW5iP.jpg',
            latitudeKey: 'latitude',
            longitudeKey: 'longitude',
            geojson: {
                "type": "FeatureCollection",
                "features": [{
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.504982, -34.659614]
                    },
                    "type": "Feature",
                    "id": "Feature|1",
                    "properties": {
                        "Name": "Landmark 1",
                        "Id": "Feature|1"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.48353, -34.631904]
                    },
                    "type": "Feature",
                    "id": "Feature|2",
                    "properties": {
                        "Name": "Landmark 2",
                        "Id": "Feature|2"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.516081, -34.608215]
                    },
                    "type": "Feature",
                    "id": "Feature|3",
                    "properties": {
                        "Name": "Landmark 3",
                        "Id": "Feature|3"
                    }
                }]
            },
            models: {
                file: {
                    name: 'File 1'
                },
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '7ogPbIz9',
            name: 'Map 2',
            description: 'An example map.',
            notes: 'Lorem ipsum dolor sit amet...',
            basemap: 'satellite',
            url: 'http://i.imgur.com/ZjlW5iP.jpg',
            latitudeKey: 'latitude',
            longitudeKey: 'longitude',
            geojson: {
                "type": "FeatureCollection",
                "features": [{
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.504982, -34.659614]
                    },
                    "type": "Feature",
                    "id": "Feature|1",
                    "properties": {
                        "Name": "Landmark 1",
                        "Id": "Feature|1"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.48353, -34.631904]
                    },
                    "type": "Feature",
                    "id": "Feature|2",
                    "properties": {
                        "Name": "Landmark 2",
                        "Id": "Feature|2"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.516081, -34.608215]
                    },
                    "type": "Feature",
                    "id": "Feature|3",
                    "properties": {
                        "Name": "Landmark 3",
                        "Id": "Feature|3"
                    }
                }]
            },
            models: {
                file: {
                    name: 'File 2'
                },
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '8ogPbIz9',
            name: 'Map 3',
            description: 'An example map.',
            notes: 'Lorem ipsum dolor sit amet...',
            basemap: 'hybrid',
            url: 'http://i.imgur.com/ZjlW5iP.jpg',
            latitudeKey: 'latitude',
            longitudeKey: 'longitude',
            geojson: {
                "type": "FeatureCollection",
                "features": [{
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.504982, -34.659614]
                    },
                    "type": "Feature",
                    "id": "Feature|1",
                    "properties": {
                        "Name": "Landmark 1",
                        "Id": "Feature|1"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.48353, -34.631904]
                    },
                    "type": "Feature",
                    "id": "Feature|2",
                    "properties": {
                        "Name": "Landmark 2",
                        "Id": "Feature|2"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.516081, -34.608215]
                    },
                    "type": "Feature",
                    "id": "Feature|3",
                    "properties": {
                        "Name": "Landmark 3",
                        "Id": "Feature|3"
                    }
                }]
            },
            models: {
                file: {
                    name: 'File 3'
                },
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '9ogPbIz9',
            name: 'Map 4',
            description: 'An example map.',
            notes: 'Lorem ipsum dolor sit amet...',
            basemap: 'terrain',
            url: 'http://i.imgur.com/ZjlW5iP.jpg',
            latitudeKey: 'latitude',
            longitudeKey: 'longitude',
            geojson: {
                "type": "FeatureCollection",
                "features": [{
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.504982, -34.659614]
                    },
                    "type": "Feature",
                    "id": "Feature|1",
                    "properties": {
                        "Name": "Landmark 1",
                        "Id": "Feature|1"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.48353, -34.631904]
                    },
                    "type": "Feature",
                    "id": "Feature|2",
                    "properties": {
                        "Name": "Landmark 2",
                        "Id": "Feature|2"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.516081, -34.608215]
                    },
                    "type": "Feature",
                    "id": "Feature|3",
                    "properties": {
                        "Name": "Landmark 3",
                        "Id": "Feature|3"
                    }
                }]
            },
            models: {
                file: {
                    name: 'File 4'
                },
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '10gPbIz9',
            name: 'Map 5',
            description: 'An example map.',
            notes: 'Lorem ipsum dolor sit amet...',
            basemap: 'roadmap',
            url: 'http://i.imgur.com/ZjlW5iP.jpg',
            latitudeKey: 'latitude',
            longitudeKey: 'longitude',
            geojson: {
                "type": "FeatureCollection",
                "features": [{
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.504982, -34.659614]
                    },
                    "type": "Feature",
                    "id": "Feature|1",
                    "properties": {
                        "Name": "Landmark 1",
                        "Id": "Feature|1"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.48353, -34.631904]
                    },
                    "type": "Feature",
                    "id": "Feature|2",
                    "properties": {
                        "Name": "Landmark 2",
                        "Id": "Feature|2"
                    }
                }, {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-58.516081, -34.608215]
                    },
                    "type": "Feature",
                    "id": "Feature|3",
                    "properties": {
                        "Name": "Landmark 3",
                        "Id": "Feature|3"
                    }
                }]
            },
            models: {
                file: {
                    name: 'File 5'
                },
                createdBy: {
                    username: 'admin'
                }
            }
        }],
        View: [{
            id: '1ogP1Iz9',
            name: 'View 1',
            description: 'An example view.',
            notes: 'Lorem ipsum dolor sit amet...',
            models: {
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                }
            }
        }, {
            id: '2ogP2Iz9',
            name: 'View 2',
            description: 'An example view.',
            notes: 'Lorem ipsum dolor sit amet...',
            models: {
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                }
            }
        }, {
            id: '3ogP3Iz9',
            name: 'View 3',
            description: 'An example view.',
            notes: 'Lorem ipsum dolor sit amet...',
            models: {
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 7', 'Tag 8', 'Tag 9']
                }
            }
        }, {
            id: '4ogP4Iz9',
            name: 'View 4',
            description: 'An example view.',
            notes: 'Lorem ipsum dolor sit amet...',
            models: {
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                }
            }
        }, {
            id: '5ogP5Iz9',
            name: 'View 5',
            description: 'An example view.',
            notes: 'Lorem ipsum dolor sit amet...',
            models: {
                createdBy: {
                    username: 'admin'
                }
            },
            collections: {
                // Queries a 'where' query internally
                // with {username: user} as object.
                // resulting documents are added to the
                // alias of the 'user' association
                tag: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                }
            }
        }],
        Config: [{
            id: '1ogPzIz9',
            description: 'Modelos logueados',
            type: 'string',
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
            type: 'string',
            model: 'Statuses',
            key: 'defaultStatus',
            value: 'nWRhpRV',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '2ogPzIz9',
            description: 'Estado publicado',
            type: 'string',
            model: 'Statuses',
            key: 'publishStatus',
            value: 'nWRhpRV',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '3ogPzIz9',
            description: 'Estado despublicado',
            type: 'string',
            model: 'Statuses',
            key: 'unpublishStatus',
            value: 'nWRhpRV',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }],
        Log: [{
            id: '6ogPaIz9',
            action: 'create',
            target: 'organization',
            resource: 'eWRhpRV',
            models: {
                user: {
                    username: 'admin'
                }
            }
        }, {
            id: '2ogPbIz9',
            action: 'update',
            target: 'user',
            resource: 'nYrnfYEv',
            models: {
                user: {
                    username: 'admin'
                }
            }
        }, {
            id: '3ogPcIz9',
            action: 'delete',
            target: 'category',
            resource: 'iWRhpRV',
            models: {
                user: {
                    username: 'admin'
                }
            }
        }, {
            id: '4ogPdIz9',
            action: 'create',
            target: 'status',
            resource: 'pWRhpRV',
            models: {
                user: {
                    username: 'admin'
                }
            }
        }, {
            id: '5ogPfIz9',
            action: 'update',
            target: 'dataset',
            resource: 'sWRhpRl',
            models: {
                user: {
                    username: 'admin'
                }
            }
        }, {
            id: '6ogPgIz9',
            action: 'delete',
            target: 'file',
            resource: 'tWRhpRb',
            models: {
                user: {
                    username: 'admin'
                }
            }
        }],
        Statistic: [{
            id: 'B12SrQH_',
            method: 'OPTIONS',
            resource: 'File',
            endpoint: '/files/tWRhpRb',
            querystring: '{ include: tags };',
            client: '',
            useragent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36',
            ip: '127.0.0.1'
        }, {
            id: 'B13SrQH_',
            method: 'OPTIONS',
            resource: 'File',
            endpoint: '/files/tWRhpRb',
            querystring: '{ include: tags };',
            client: '',
            useragent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36',
            ip: '127.0.0.1'
        }, {
            id: 'B225rQH_',
            method: 'GET',
            resource: 'File',
            endpoint: '/files/first',
            querystring: '',
            client: '',
            useragent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36',
            ip: '127.0.0.1'
        }]
    }
};
