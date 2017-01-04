
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('config', function (t) {
          t.boolean('editable').defaultsTo(true);
      })
      // .catch(function (error) {
      //     console.log(error);
      // });
};
exports.down = function(knex, Promise) {

};
