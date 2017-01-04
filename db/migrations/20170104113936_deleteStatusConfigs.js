exports.up = function(knex, Promise) {
    return Promise.all([
        knex('config').where('id', '2ogPzIz9').del(),
        knex('config').where('id', '3ogPzIz9').del(),
        knex('config').where('id', '4ogPzIz9').del(),
        knex('config').where('id', 'cogPzIz9').del(),
    ])
    .catch(function(error) {
        console.log(error);
    });
};

exports.down = function(knex, Promise) {

};
