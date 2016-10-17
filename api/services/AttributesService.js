"use strict";

const _ = require('lodash');

module.exports = {
    baseAttributes: function(model) {
        var attributes = _.reduce(model.definition, function(accumulator, key, name) {
            accumulator[name] = _.pick(key, ['type', 'size', 'model']);
            return accumulator;
        }, {});
        _.unset(attributes, ['id', 'createdAt', 'updatedAt']);
        return attributes;
    },
    getAttributes: function(model) {

        return _.merge({
            id: {
                type: 'string'
            },
            createdAt: {
                type: 'datetime'
            },
            updatedAt: {
                type: 'datetime'
            }
        }, AttributesService.baseAttributes(model));
    },
    setAttributes: function(model) {
        return AttributesService.baseAttributes(model);
    },
    countAttributes: function() {
        return {
            count: 'integer'
        };
    }
};
