exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('category_datasetssubcategories__dataset_subcategories', function(t) {
            t.increments();
            t.text('category_datasetsSubcategories');
            t.text('dataset_subcategories')
        })
        .catch(function(error) {
            console.log(error);
        });
};
exports.down = function(knex, Promise) {

};
