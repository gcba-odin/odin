exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.hasColumn('dataset', 'disclaimer').then(exists => {
            if (exists) {
                return knex.schema.alterTable('dataset', function(t) {
                    return t.dropColumn('disclaimer');
                })
            }
        }),
        knex.schema.hasColumn('file', 'collection').then(exists => {
            if (exists) {
                return knex.schema.alterTable('file', function(t) {
                    return t.dropColumn('collection');
                })
            }
        }),
        knex.schema.hasColumn('file', 'updateDate').then(exists => {
            if (exists) {
                return knex.schema.alterTable('file', function(t) {
                    t.dropColumn('updateDate');
                })
            }
        }),
        knex.schema.dropTableIfExists('mimetype')
    ])
};

exports.down = function(knex, Promise) {

};
