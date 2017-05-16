exports.up = function(knex, Promise) {
    return knex.schema.createTable('metric', function(table) {
        table.string('id').notNullable().primary();
        table.string('dataset').unique().index();
        table.integer('count');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
    })
};

exports.down = function(knex, Promise) {};
