exports.up = function(knex, Promise) {
    return knex.schema.alterTable('file', function(t) {
        t.boolean('urgent');
    });
};

exports.down = function(knex, Promise) {};
