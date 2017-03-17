exports.up = function(knex, Promise) {
    return Promise.all([knex.schema.createTable('users', function(table) {
            table.string('id').notNullable().primary();
            table.string('about');
            table.string('description');
            table.string('email');
        }),
        knex.schema.createTableIfNotExists('category_requests__datasetrequest_categories', function(t) {
            t.increments();
            t.text('category_requests');
            t.text('datasetrequest_categories')
        })
    ])
};

exports.down = function(knex, Promise) {

};
