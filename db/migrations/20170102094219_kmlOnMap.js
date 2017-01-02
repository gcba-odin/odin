exports.up = function (knex, Promise) {
    return knex.schema.alterTable('map', function (t) {
            t.boolean('kml');
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.down = function (knex, Promise) {

};
