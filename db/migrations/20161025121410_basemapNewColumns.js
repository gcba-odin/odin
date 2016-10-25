exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('basemap', function(t) {
            t.boolean('tms').defaultsTo(false);
            t.integer('maxZoom').defaultsTo(18);
            t.integer('minZoom').defaultsTo(0);
            t.json('optionals');
        })
    ]).catch(function(error) {
        console.log(error);
    });

};

exports.down = function(knex, Promise) {

};