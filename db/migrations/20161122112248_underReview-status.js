var moment = require('moment');

exports.up = function(knex, Promise) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss Z');
    var underReviewStatus = {
        id: 'cogPzIz9',
        description: 'Estado en revisión',
        type: 'model',
        multiple: false,
        model: 'Statuses',
        key: 'underReviewStatus',
        value: 'oWRhpRV',
        updatedBy: '',
        createdAt: now,
        updatedAt: now
    };
    return Promise.all([
        knex.insert(underReviewStatus).into('config'),
    ]).catch(function(error) {
        console.log(error);
    });
};

exports.down = function(knex, Promise) {

};
