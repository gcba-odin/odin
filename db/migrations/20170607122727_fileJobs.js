exports.up = function(knex, Promise) {
    return knex.schema.createTable('filejob', function(table) {
        table.increments('id');
        table.string('file').unique().index();
        table.boolean('finish');
        table.priority('finish');
        table.timestamp('endDate');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
    })
};

exports.down = function(knex, Promise) {

};
