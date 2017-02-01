exports.up = function(knex, Promise) {
    return knex.schema.alterTable('config', function(t) {
            t.text('category');
            t.text('parent');
            t.text('tooltip');
            t.boolean('required');
        })
        .catch(function(error) {
            console.log(error);
        });
};

exports.down = function(knex, Promise) {

};
