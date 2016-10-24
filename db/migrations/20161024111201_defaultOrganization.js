var moment = require('moment');

exports.up = function (knex, Promise) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss Z');
    var defaultOrganization = {
        id: 'bogPzIz9',
        description: 'Organizacion por defecto',
        type: 'model',
        multiple: false,
        model: 'Organizations',
        key: 'defaultOrganization',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now
    };
    var defaultMaxZoom= {
        id: '9ogPzIz9',
        description: 'Zoom maximo en la creacion de mapa base',
        type: 'integer',
        multiple: false,
        key: 'defaultMaxZoom',
        value: 18,
        createdAt: now,
        updatedAt: now
    };
    var defaultMinZoom = {
        id: 'aogPzIz9',
        description: 'Zoom minimo en la creacion de mapa base',
        type: 'integer',
        multiple: false,
        key: 'defaultMinZoom',
        value: 0,
        createdAt: now,
        updatedAt: now
    };
    return Promise.all([
        knex.insert(defaultMinZoom).into('config'),
        knex.insert(defaultMaxZoom).into('config'),
        knex.insert(defaultOrganization).into('config')
    ]);
};

exports.down = function (knex, Promise) {

};
