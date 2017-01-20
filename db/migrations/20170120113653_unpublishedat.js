exports.up = function (knex, Promise) {
    return knex.schema.alterTable('dataset', function (t) {
            t.timestamp('unPublishedAt');
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.down = function (knex, Promise) {

};
