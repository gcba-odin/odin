module.exports = {
    fixtures: {
        order: ['Users', 'Organizations', 'Categories', 'Statuses', 'Filetypes', 'Files', 'Databases', 'Datasets'],
        Users: [
            {
                id: 'dogPzIz8',
                username: 'henrywagner',
                password: '123',
                email: 'hwagner0@merriam-webster.com',
                firstName: 'Henry',
                lastName: 'Wagner',
                avatar: '',
                active: true,
                organization: '23TplPdS',
                createdBy: 'dogPzIz8'
            },
            {
                id: 'nYrnfYEv',
                username: 'howardfoster',
                password: '123',
                email: 'hfoster1@cbsnews.com',
                firstName: 'Howard',
                lastName: 'Foster',
                avatar: '',
                active: true,
                organization: '23TplPdS',
                createdBy: 'dogPzIz8'
            },
            {
                id: 'a4vhAoFG',
                username: 'ashleychavez',
                password: '123',
                email: 'achavez2@go.com',
                firstName: 'Ashley',
                lastName: 'Chavez',
                avatar: '',
                active: true,
                organization: '23TplPdS',
                createdBy: 'dogPzIz8'
            },
            {
                id: 'hwX6aOr7',
                username: 'melissafrazier',
                password: '123',
                email: 'mfrazier3@gizmodo.com',
                firstName: 'Melissa',
                lastName: 'Frazier',
                avatar: '',
                active: true,
                organization: '23TplPdS',
                createdBy: 'dogPzIz8'
            },
            {
                id: 'eWRhpRV',
                username: 'petermorrison',
                password: '123',
                email: 'pmorrison4@wp.com',
                firstName: 'Peter',
                lastName: 'Morrison',
                avatar: '',
                active: true,
                organization: '23TplPdS',
                createdBy: 'dogPzIz8'
            }
        ],
        Organizations: [
            {
                id: 'eWRhpRV',
                name: 'ACME',
                description: 'An example organization.',
                address: 'Example Ave. 254',
                active: true,
                parent: undefined,
                createdBy: 'dogPzIz8'
            },
            {
                id: 'dWRhpRV',
                name: 'Umbrella Corp',
                description: 'An example organization.',
                address: 'Example Ave. 255',
                active: true,
                parent: undefined,
                createdBy: 'dogPzIz8'
            },
            {
                id: 'fWRhpRV',
                name: 'Star Labs',
                description: 'An example organization.',
                address: 'Example Ave. 256',
                active: true,
                parent: undefined,
                createdBy: 'dogPzIz8'
            },
            {
                id: 'gWRhpRV',
                name: 'Aperture Labs',
                description: 'An example organization.',
                address: 'Example Ave. 257',
                active: true,
                parent: undefined,
                createdBy: 'dogPzIz8'
            },
            {
                id: 'hWRhpRV',
                name: 'Oscorp',
                description: 'An example organization.',
                address: 'Example Ave. 258',
                active: true,
                parent: undefined,
                createdBy: 'dogPzIz8'
            }  
        ],
        Categories: [
            {
                id: 'iWRhpRV',
                name: 'Art',
                description: 'An example category.',
                createdBy: 'dogPzIz8'
            },
            {
                id: 'jWRhpRV',
                name: 'Science',
                description: 'An example category.',
                createdBy: 'dogPzIz8'
            },
            {
                id: 'kWRhpRV',
                name: 'Public Health',
                description: 'An example category.',
                createdBy: 'dogPzIz8'
            },
            {
                id: 'lWRhpRV',
                name: 'Technology',
                description: 'An example category.',
                createdBy: 'dogPzIz8'
            },
            {
                id: 'mWRhpRV',
                name: 'Other',
                description: 'An example category.',
                createdBy: 'dogPzIz8'
            }
        ],
        Statuses: [
            {
                id: 'nWRhpRV',
                name: 'Draft'
            },
            {
                id: 'oWRhpRV',
                name: 'Under review'
            },
            {
                id: 'pWRhpRV',
                name: 'Rejected'
            },
            {
                id: 'qWRhpRV',
                name: 'Published'
            },
            {
                id: 'rWRhpRV',
                name: 'Unpublished'
            }
        ],
        Filetypes: [
            {
                id: 'sWRhpRV',
                name: 'csv'
            },
            {
                id: 'tWRhpRV',
                name: 'html'
            },
            {
                id: 'uWRhpRV',
                name: 'ics'
            },
            {
                id: 'vWRhpRV',
                name: 'pdf'
            },
            {
                id: 'wWRhpRV',
                name: 'rar'
            },
            {
                id: 'xWRhpRV',
                name: 'shp'
            },
            {
                id: 'yWRhpRV',
                name: 'xls'
            },
            {
                id: 'zWRhpRV',
                name: 'xml'
            },
            {
                id: '0WRhpRV',
                name: 'zip'
            }
        ],
        Files: [
            {
                id: 'sWRhpRa',
                name: 'File 1',
                description: 'An example file.',
                notes: 'Lorem ipsum dolor sit amet...',
                url: 'http://i.imgur.com/u7CUz6v.png',
                visibility: 1,
                publishedAt: '2011-01-01 00:00:01+03'
            },
            {
                id: 'tWRhpRb',
                name: 'File 2',
                description: 'An example file.',
                notes: 'Lorem ipsum dolor sit amet...',
                url: 'http://i.imgur.com/u7CUz6v.png',
                visibility: 1,
                publishedAt: '2011-01-01 00:00:02+03'
            },
            {
                id: 'uWRhpRc',
                name: 'File 3',
                description: 'An example file.',
                notes: 'Lorem ipsum dolor sit amet...',
                url: 'http://i.imgur.com/u7CUz6v.png',
                visibility: 1,
                publishedAt: '2011-01-01 00:00:03+03'
            },
            {
                id: 'vWRhpRd',
                name: 'File 4',
                description: 'An example file.',
                notes: 'Lorem ipsum dolor sit amet...',
                url: 'http://i.imgur.com/u7CUz6v.png',
                visibility: 1,
                publishedAt: '2011-01-01 00:00:04+03'
            },
            {
                id: 'wWRhpRe',
                name: 'File 5',
                description: 'An example file.',
                notes: 'Lorem ipsum dolor sit amet...',
                url: 'http://i.imgur.com/u7CUz6v.png',
                visibility: 1,
                publishedAt: '2011-01-01 00:00:05+03'
            }
        ],
        Databases: [
            {
                id: 'sWRhpRf',
                name: 'Database 1',
                collection: 'ExampleCollection',
                url: 'http://i.imgur.com/u7CUz6v.png'
            },
            {
                id: 'sWRhpRg',
                name: 'Database 2',
                collection: 'ExampleCollection',
                url: 'http://i.imgur.com/u7CUz6v.png'
            },
            {
                id: 'sWRhpRh',
                name: 'Database 3',
                collection: 'ExampleCollection',
                url: 'http://i.imgur.com/u7CUz6v.png'
            },
            {
                id: 'sWRhpRi',
                name: 'Database 4',
                collection: 'ExampleCollection',
                url: 'http://i.imgur.com/u7CUz6v.png'
            },
            {
                id: 'sWRhpRj',
                name: 'Database 5',
                collection: 'ExampleCollection',
                url: 'http://i.imgur.com/u7CUz6v.png'
            }
        ],
        Datasets: [
            {
                id: 'sWRhpRk',
                name: 'Dataset 1',
                description: 'An example dataset.',
                notes: 'Lorem ipsum dolor sit amet...',
                visibility: 1,
                starred: true,
                optional1: undefined,
                optional2: undefined,
                optional3: undefined,
                optional4: undefined,
                optional5: undefined,
                optional6: undefined,
                optional7: undefined,
                optional8: undefined,
                optional9: undefined,
                optional10: undefined,
                publishedAt: '2011-01-01 00:00:01+03'
            },
            {
                id: 'sWRhpRl',
                name: 'Dataset 2',
                description: 'An example dataset.',
                notes: 'Lorem ipsum dolor sit amet...',
                visibility: 1,
                starred: true,
                optional1: undefined,
                optional2: undefined,
                optional3: undefined,
                optional4: undefined,
                optional5: undefined,
                optional6: undefined,
                optional7: undefined,
                optional8: undefined,
                optional9: undefined,
                optional10: undefined,
                publishedAt: '2011-01-01 00:00:02+03'
            },
            {
                id: 'sWRhpRm',
                name: 'Dataset 3',
                description: 'An example dataset.',
                notes: 'Lorem ipsum dolor sit amet...',
                visibility: 1,
                starred: true,
                optional1: undefined,
                optional2: undefined,
                optional3: undefined,
                optional4: undefined,
                optional5: undefined,
                optional6: undefined,
                optional7: undefined,
                optional8: undefined,
                optional9: undefined,
                optional10: undefined,
                publishedAt: '2011-01-01 00:00:03+03'
            },
            {
                id: 'sWRhpRn',
                name: 'Dataset 4',
                description: 'An example dataset.',
                notes: 'Lorem ipsum dolor sit amet...',
                visibility: 1,
                starred: true,
                optional1: undefined,
                optional2: undefined,
                optional3: undefined,
                optional4: undefined,
                optional5: undefined,
                optional6: undefined,
                optional7: undefined,
                optional8: undefined,
                optional9: undefined,
                optional10: undefined,
                publishedAt: '2011-01-01 00:00:04+03'
            },
            {
                id: 'sWRhpRo',
                name: 'Dataset 5',
                description: 'An example dataset.',
                notes: 'Lorem ipsum dolor sit amet...',
                visibility: 1,
                starred: true,
                optional1: undefined,
                optional2: undefined,
                optional3: undefined,
                optional4: undefined,
                optional5: undefined,
                optional6: undefined,
                optional7: undefined,
                optional8: undefined,
                optional9: undefined,
                optional10: undefined,
                publishedAt: '2011-01-01 00:00:05+03'
            }
        ]
    }
}