exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('filetype', function(t) {
            t.text('createdBy');
        }),
        knex.schema.alterTable('status', function(t) {
            t.text('createdBy');
        }),
        knex.schema.alterTable('updatefrequency', function(t) {
            t.text('createdBy');
        })
    ]).catch(function(error) {
        console.log(error);
    });
};

exports.down = function(knex, Promise) {

};
