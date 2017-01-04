exports.up = function(knex, Promise) {
    return Promise.all([
        knex('config').where('id', '!=','1ogPzIz9').update({
            editable: true
        }),
        knex('config').where('id', '=','1ogPzIz9').update({
            editable: false
        }),
    ])
    // .catch(function(error) {
    //     console.log(error);
    // });
};

exports.down = function(knex, Promise) {

};
