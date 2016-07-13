module.exports = {
    fixtures: {
        order: [
            'Organization', 'User', 'Category', 'Status', 'Database', 'Filetype', 'UpdateFrequency',
            'Tag', 'Dataset', 'File', 'Chart', 'Map', 'View', 'Config', 'Log'
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
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'lWRhpRV',
            name: 'Gobierno y Administración pública',
            description: 'An example category.',
            active: false,
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
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }],
        Status: [{
            id: 'nWRhpRV',
            name: 'Draft'
        }, {
            id: 'oWRhpRV',
            name: 'Under Review'
        }, {
            id: 'pWRhpRV',
            name: 'Rejected'
        }, {
            id: 'qWRhpRV',
            name: 'Published'
        }, {
            id: 'rWRhpRV',
            name: 'Unpublished'
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
        Filetype: [{
            id: 'sWRhpRV',
            name: 'csv',
            api: true
        }, {
            id: 'tWRhpRV',
            name: 'html',
            api: false
        }, {
            id: 'uWRhpRV',
            name: 'ics',
            api: false
        }, {
            id: 'vWRhpRV',
            name: 'pdf',
            api: false
        }, {
            id: 'wWRhpRV',
            name: 'rar',
            api: false
        }, {
            id: 'xWRhpRV',
            name: 'shp',
            api: false
        }, {
            id: 'yWRhpRV',
            name: 'xls',
            api: true
        }, {
            id: '1WRhpRV',
            name: 'xlsx',
            api: true
        }, {
            id: 'zWRhpRV',
            name: 'xml',
            api: false
        }, {
            id: '0WRhpRV',
            name: 'zip',
            api: false
        }],
        UpdateFrequency: [{
            id: 'tWRhpR2',
            name: 'Eventual'
        }, {
            id: 'zWRhpR8',
            name: 'Biannual'
        }, {
            id: 'sWRhpR1',
            name: 'Annual'
        }, {
            id: 'wWRhpR5',
            name: 'Semestral'
        }, {
            id: 'vWRhpR4',
            name: 'Quarterly'
        }, {
            id: '0WRhpR9',
            name: 'Bimonthly'
        }, {
            id: 'uWRhpR3',
            name: 'Monthly'
        }, {
            id: 'yWRhpR7',
            name: 'Weekly'
        }, {
            id: 'xWRhpR6',
            name: 'Real Time'
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
            optional1: null,
            optional2: null,
            optional3: null,
            optional4: null,
            optional5: null,
            optional6: null,
            optional7: null,
            optional8: null,
            optional9: null,
            optional10: null,
            publishedAt: '2011-01-01 00:00:01+03',
            models: {
                category: {
                    name: 'Cultura, Recreación y Turismo'
                },
                status: {
                    name: 'Draft'
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
            id: 'sWRhpRl',
            name: 'Dataset 2',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optional1: null,
            optional2: null,
            optional3: null,
            optional4: null,
            optional5: null,
            optional6: null,
            optional7: null,
            optional8: null,
            optional9: null,
            optional10: null,
            publishedAt: '2011-01-01 00:00:02+03',
            models: {
                category: {
                    name: 'Economía, negocio y comercio'
                },
                status: {
                    name: 'Under Review'
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
            id: 'sWRhpRm',
            name: 'Dataset 3',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optional1: null,
            optional2: null,
            optional3: null,
            optional4: null,
            optional5: null,
            optional6: null,
            optional7: null,
            optional8: null,
            optional9: null,
            optional10: null,
            publishedAt: '2011-01-01 00:00:03+03',
            models: {
                category: {
                    name: 'Educación'
                },
                status: {
                    name: 'Rejected'
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
            id: 'sWRhpRn',
            name: 'Dataset 4',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optional1: null,
            optional2: null,
            optional3: null,
            optional4: null,
            optional5: null,
            optional6: null,
            optional7: null,
            optional8: null,
            optional9: null,
            optional10: null,
            publishedAt: '2011-01-01 00:00:04+03',
            models: {
                category: {
                    name: 'Gobierno y administración pública'
                },
                status: {
                    name: 'Published'
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
            id: 'sWRhpRo',
            name: 'Dataset 5',
            description: 'An example dataset.',
            notes: 'Lorem ipsum dolor sit amet...',
            visible: 1,
            starred: true,
            optional1: null,
            optional2: null,
            optional3: null,
            optional4: null,
            optional5: null,
            optional6: null,
            optional7: null,
            optional8: null,
            optional9: null,
            optional10: null,
            publishedAt: '2011-01-01 00:00:05+03',
            models: {
                category: {
                    name: 'Medio ambiente'
                },
                status: {
                    name: 'Unpublished'
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
        File: [{
            id: 'sWRhpRa',
            name: 'File 1',
            description: 'An example file.',
            notes: 'Lorem ipsum dolor sit amet...',
            url: 'http://i.imgur.com/u7CUz6v.png',
            visible: 1,
            publishedAt: '2011-01-01 00:00:01+03',
            models: {
                type: {
                    name: 'csv'
                },
                status: {
                    name: 'Draft'
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
            publishedAt: '2011-01-01 00:00:02+03',
            models: {
                type: {
                    name: 'html'
                },
                status: {
                    name: 'Under Review'
                },
                organization: {
                    name: 'Umbrella Corp'
                },
                dataset: {
                    name: 'Dataset 2'
                },
                updateFrequency: {
                    name: 'Annual'
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
            publishedAt: '2011-01-01 00:00:03+03',
            models: {
                type: {
                    name: 'ics'
                },
                status: {
                    name: 'Rejected'
                },
                organization: {
                    name: 'Oscorp'
                },
                dataset: {
                    name: 'Dataset 3'
                },
                updateFrequency: {
                    name: 'Monthly'
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
            publishedAt: '2011-01-01 00:00:04+03',
            models: {
                type: {
                    name: 'rar'
                },
                status: {
                    name: 'Published'
                },
                organization: {
                    name: 'Aperture Labs'
                },
                dataset: {
                    name: 'Dataset 4'
                },
                updateFrequency: {
                    name: 'Weekly'
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
            publishedAt: '2011-01-01 00:00:05+03',
            models: {
                type: {
                    name: 'pdf'
                },
                status: {
                    name: 'Unpublished'
                },
                organization: {
                    name: 'ACME'
                },
                dataset: {
                    name: 'Dataset 5'
                },
                updateFrequency: {
                    name: 'Quarterly'
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
        Map: [{
            id: '6ogPbIz9',
            name: 'Map 1',
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
                        "Nombre": "Landmark 1",
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
                        "Nombre": "Landmark 1",
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
                        "Nombre": "Landmark 1",
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
                        "Nombre": "Landmark 1",
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
                        "Nombre": "Landmark 1",
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
            description: 'Models that will be logged',
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
            id: '2ogPzIz9',
            description: 'An example config.',
            type: 'string',
            key: 'key',
            value: 'value',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '3ogPzIz9',
            description: 'An example config.',
            type: 'string',
            key: 'key',
            value: 'value',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '4ogPzIz9',
            description: 'An example config.',
            type: 'string',
            key: 'key',
            value: 'value',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '5ogPzIz9',
            description: 'An example config.',
            type: 'string',
            key: 'key',
            value: 'value',
            models: {
                updatedBy: {
                    username: 'admin'
                }
            }
        }, {
            id: '6ogPzIz9',
            description: 'An example config.',
            type: 'string',
            key: 'key',
            value: 'value',
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
        }]
    }
};