exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('file', function(t) {
          t.timestamp('unPublishedAt');
          t.timestamp('rejectedAt');
          t.timestamp('cancelledAt');
          t.timestamp('reviewedAt');
        }),
        knex.schema.alterTable('map', function(t) {
          t.timestamp('unPublishedAt');
          t.timestamp('rejectedAt');
          t.timestamp('cancelledAt');
          t.timestamp('reviewedAt');
        }),
        knex.schema.alterTable('chart', function(t) {
          t.timestamp('unPublishedAt');
          t.timestamp('rejectedAt');
          t.timestamp('cancelledAt');
          t.timestamp('reviewedAt');
        })
    ]).catch(function(error) {
        console.log(error);
    });
};

exports.down = function(knex, Promise) {

};
