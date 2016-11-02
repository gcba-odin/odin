var moment = require('moment');

exports.up = function(knex, Promise) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss Z');
    var defaultOptions = {
        id: 'fogPzIz9',
        description: 'Opcionales por default',
        type: 'string',
        multiple: true,
        key: 'defaultOptionals',
        value: [],
        createdAt: now,
        updatedAt: now
    };
    return Promise.all([
        knex.insert(defaultOptions).into('config')
    ]).catch(function(error) {
        console.log(error);
    });
};

exports.down = function(knex, Promise) {

};