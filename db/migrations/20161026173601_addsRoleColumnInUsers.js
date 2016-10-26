exports.up = function (knex, Promise) {
    return knex.schema.alterTable('user', function (t) {
            t.string('role').defaultsTo('superadmin');
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.down = function (knex, Promise) {

};
