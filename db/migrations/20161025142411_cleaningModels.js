exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('dataset', function(t) {
            t.dropColumn('disclaimer');
        }),
        knex.schema.alterTable('file', function(t) {
            t.dropColumn('collection');
            t.dropColumn('updateDate');
        }),
        knex.schema.dropTableIfExists('mimetype')

    ]).catch(function(error) {
        console.log(error);
    });

};

exports.down = function(knex, Promise) {

};