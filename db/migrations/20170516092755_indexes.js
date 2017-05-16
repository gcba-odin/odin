exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('category', function(t) {
            t.index('slug');
        }),
        knex.schema.alterTable('dataset', function(t) {
            t.index('slug');
        }),
        knex.schema.alterTable('file', function(t) {
            t.index('fileName');
        }),
        knex.schema.alterTable('filetype', function(t) {
            t.index('slug');
        }),
        knex.schema.alterTable('organization', function(t) {
            t.index('slug');
        }),
        knex.schema.alterTable('tag', function(t) {
            t.index('slug');
        }),
        knex.schema.alterTable('config', function(t) {
            t.index('slug');
        }),
        knex.schema.alterTable('user', function(t) {
            t.index('username');
        }),
        knex.schema.alterTable('config', function(t) {
            t.index('key');
            t.index('description');
        })
    ])
}
exports.down = function(knex, Promise) {};
