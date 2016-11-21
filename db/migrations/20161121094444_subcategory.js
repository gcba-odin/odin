exports.up = function (knex, Promise) {
    return knex.schema.alterTable('category', function (t) {
            t.text('parent');
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.down = function (knex, Promise) {

};
