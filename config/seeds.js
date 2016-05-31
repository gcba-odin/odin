module.exports = {
    fixtures: {
        order: ['Organization', 'User', 'Category', 'Status', 'Database', 'Filetype', 'UpdateFrequency', 'Tag', 'Dataset', 'File', 'Config'],
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
            createdBy: 'dogPzIz9',
        }, {
            id: 'dWRhpRV',
            name: 'Umbrella Corp',
            description: 'An example organization.',
            address: 'Example Ave. 255',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9',
        }, {
            id: 'fWRhpRV',
            name: 'Star Labs',
            description: 'An example organization.',
            address: 'Example Ave. 256',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9',
        }, {
            id: 'gWRhpRV',
            name: 'Aperture Labs',
            description: 'An example organization.',
            address: 'Example Ave. 257',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9',
        }, {
            id: 'hWRhpRV',
            name: 'Oscorp',
            description: 'An example organization.',
            address: 'Example Ave. 258',
            active: true,
            parent: null,
            createdBy: 'dogPzIz9',
        }],
        Category: [{
            id: 'iWRhpRV',
            name: 'Art',
            description: 'An example category.',
            active: true,
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'jWRhpRV',
            name: 'Science',
            description: 'An example category.',
            active: true,
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'kWRhpRV',
            name: 'Public Health',
            description: 'An example category.',
            active: true,
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'lWRhpRV',
            name: 'Technology',
            description: 'An example category.',
            active: false,
            models: {
                createdBy: {
                    username: 'admin'
                }
            }
        }, {
            id: 'mWRhpRV',
            name: 'Other',
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
            name: 'csv'
        }, {
            id: 'tWRhpRV',
            name: 'html'
        }, {
            id: 'uWRhpRV',
            name: 'ics'
        }, {
            id: 'vWRhpRV',
            name: 'pdf'
        }, {
            id: 'wWRhpRV',
            name: 'rar'
        }, {
            id: 'xWRhpRV',
            name: 'shp'
        }, {
            id: 'yWRhpRV',
            name: 'xls'
        }, {
            id: 'zWRhpRV',
            name: 'xml'
        }, {
            id: '0WRhpRV',
            name: 'zip'
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
                    name: 'Art'
                },
                status: {
                    name: 'Draft'
                },
                tags: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
            category: 'jWRhpRV',
            status: 'oWRhpRV',
            models: {
                category: {
                    name: 'Science'
                },
                status: {
                    name: 'Under Review'
                },
                tags: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
            category: 'kWRhpRV',
            status: 'pWRhpRV',
            models: {
                category: {
                    name: 'Public Health'
                },
                status: {
                    name: 'Rejected'
                },
                tags: {
                    name: ['Tag 7', 'Tag 8', 'Tag 9']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
            category: 'lWRhpRV',
            status: 'qWRhpRV',
            models: {
                category: {
                    name: 'Technology'
                },
                status: {
                    name: 'Published'
                },
                tags: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
            category: 'mWRhpRV',
            status: 'rWRhpRV',
            models: {
                category: {
                    name: 'Other'
                },
                status: {
                    name: 'Unpublished'
                },
                tags: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
                tags: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
                tags: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
                tags: {
                    name: ['Tag 7', 'Tag 8', 'Tag 9']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
                tags: {
                    name: ['Tag 1', 'Tag 2', 'Tag 3']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
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
                tags: {
                    name: ['Tag 4', 'Tag 5', 'Tag 6']
                },
                owner: {
                    username: 'admin'
                },
                createdBy: {
                    username: 'admin'
                }
            }
        }],
        Config: [{
            id: '1ogPzIz9',
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
        }]
    }
}