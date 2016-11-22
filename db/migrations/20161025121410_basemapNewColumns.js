exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('basemap', function(t) {
            knex.schema.hasColumn('dataset', 'disclaimer').then(exists => {
                if (!exists) {
                    t.dropColumn('disclaimer');
                }
            })
            knex.schema.hasColumn('dataset', 'tms').then(exists => {
                if (!exists) {
                    t.boolean('tms').defaultsTo(false);
                }
            })
            knex.schema.hasColumn('dataset', 'maxZoom').then(exists => {
                if (!exists) {
                    t.integer('maxZoom').defaultsTo(18);
                }
            })
            knex.schema.hasColumn('dataset', 'minZoom').then(exists => {
                if (!exists) {
                    t.integer('minZoom').defaultsTo(0);
                }
            })
            knex.schema.hasColumn('dataset', 'optionals').then(exists => {
                if (!exists) {
                    t.json('optionals');
                }
            })
        })
    ])

};

exports.down = function(knex, Promise) {

};
