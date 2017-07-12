exports.up = function(knex, Promise) {
    return knex.schema.createTable('filejob', function(table) {
        table.increments('id');
        table.string('file').index();
        table.boolean('finish').defaultTo(false);
        table.boolean('new').defaultTo(true);
        table.boolean('urgent').defaultTo(false);
        table.timestamp('endDate').defaultTo(null);
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
    })
};

exports.down = function(knex, Promise) {};
