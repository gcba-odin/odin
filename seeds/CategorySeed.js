// const Promise = require("bluebird");
//
// module.exports = {
//     load() {        Promise.all([
//                 Category.findOrCreate({
//                     id: 'iWRhpRA',
//                     name: 'Category1',
//                     description: 'An example category.',
//                     active: true,
//                     color: 'F5B69E',
//                     createdBy: 'dogPzIz9'
//                 }),
//                 Category.findOrCreate({
//                     id: 'kWRhpRC',
//                     name: 'Category2',
//                     description: 'An example category.',
//                     active: false,
//                     color: 'FAF4D2',
//                     createdBy: 'dogPzIz9'
//                 }),
//                 Category.findOrCreate({
//                     id: 'mWRhpR2',
//                     name: 'Category3',
//                     description: 'An example category.',
//                     active: true,
//                     color: 'D4F1E6',
//                     createdBy: 'dogPzIz9'
//                 })
//             ])
//             .then(() => { // Subcategories
//                 Promise.all([
//                     Category.findOrCreate({
//                         id: 'jWRhpRB',
//                         name: 'Category1.sub1',
//                         description: 'An example category.',
//                         active: true,
//                         color: 'FBCDB7',
//                         createdBy: 'dogPzIz9',
//                         parent: 'iWRhpRA'
//                     }),
//                     Category.findOrCreate({
//                         id: 'kWRhpRB',
//                         name: 'Category1.sub2',
//                         description: 'An example category.',
//                         active: true,
//                         color: 'FFF4D2',
//                         createdBy: 'dogPzIz9',
//                         parent: 'iWRhpRA'
//                     }),
//                     Category.findOrCreate({
//                         id: 'kWRhpJC',
//                         name: 'Category2.sub1',
//                         description: 'An example category.',
//                         active: false,
//                         color: 'FFA4D2',
//                         createdBy: 'dogPzIz9',
//                         parent: 'kWRhpRC'
//                     })
//                 ]);
//             })
//             .then(() => {
//                 sails.log.verbose('All categories were created successfully');
//             });
//     }
// };
