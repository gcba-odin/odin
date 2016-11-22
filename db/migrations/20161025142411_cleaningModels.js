exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('dataset', function(t) {
            knex.schema.hasColumn('dataset', 'disclaimer').then(exits => {
                t.dropColumn('disclaimer');
            })
        }),
        knex.schema.alterTable('file', function(t) {
            knex.schema.hasColumn('file', 'collection').then(exits => {
                t.dropColumn('collection');
            })
            knex.schema.hasColumn('file', 'updateDate').then(exits => {
                t.dropColumn('updateDate');
            })
        }),
        knex.schema.dropTableIfExists('mimetype')

    ]).catch(function(error) {
        console.log(error);
    });

};

exports.down = function(knex, Promise) {

};
