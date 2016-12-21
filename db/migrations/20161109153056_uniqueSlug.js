exports.up = function(knex, Promise) {
    return Promise.all([
            knex.schema.alterTable('category', function(t) {
                t.dropUnique('slug')
                t.unique('slug');
            }),
            knex.schema.alterTable('organization', function(t) {
                t.dropUnique('slug')
                t.unique('slug');
            }),
            knex.schema.alterTable('dataset', function(t) {
                t.dropUnique('slug')
                t.unique('slug');
            }), knex.schema.alterTable('file', function(t) {
                t.dropUnique('fileName')
                t.unique('fileName');
            }), knex.schema.alterTable('filetype', function(t) {
                t.dropUnique('slug')
                t.unique('slug');
            }), knex.schema.alterTable('tag', function(t) {
                t.dropUnique('slug')
                t.unique('slug');
            })
        ]).catch(function(error) {
            console.log(error);
        });
};

exports.down = function(knex, Promise) {

};
