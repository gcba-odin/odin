exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.hasColumn('basemap', 'tms').then(exists => {
            if (!exists) {
                return knex.schema.alterTable('basemap', function(t) {
                    return t.boolean('tms').defaultsTo(false);
                });
            }
        }),
        knex.schema.hasColumn('basemap', 'maxZoom').then(exists => {
            if (!exists) {
                return knex.schema.alterTable('basemap', function(t) {
                    return t.integer('maxZoom').defaultsTo(18);
                });
            }
        }),
        knex.schema.hasColumn('basemap', 'minZoom').then(exists => {
            if (!exists) {
                return knex.schema.alterTable('basemap', function(t) {
                    return t.integer('minZoom').defaultsTo(0);
                });
            }
        }),
        knex.schema.hasColumn('basemap', 'optionals').then(exists => {
            if (!exists) {
                return knex.schema.alterTable('basemap', function(t) {
                    return t.json('optionals');
                });
            }
        })
    ])

};

exports.down = function(knex, Promise) {

};
