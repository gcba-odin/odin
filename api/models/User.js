"use strict";

/**
 * User
 * @description :: Model for storing users
 */
var shortId = require('shortid');

module.exports = {
    schema: true,

    attributes: {
        id: {
            type: 'string',
            unique: true,
            index: true,
            defaultsTo: shortId.generate,
            primaryKey: true,
            size: 15
        },
        username: {
            type: 'string',
            required: true,
            unique: true,
            size: 25
        },

        password: {
            type: 'string',
            required: true,
        },

        email: {
            type: 'email',
            required: true,
            unique: true,
            size: 250
        },
        firstName: {
            type: 'string',
            defaultsTo: '',
            size: 50
        },
        lastName: {
            type: 'string',
            defaultsTo: '',
            size: 100
        },
        avatar: {
            type: 'string',
            size: 500
        },
        organization: {
            model: 'organization'
        },
        createdBy: {
            model: 'user'
        },
        files: {
            collection: 'file',
            via: 'createdBy'
        },
        datasets: {
            collection: 'dataset',
            via: 'createdBy'
        },
        //TODO: test this
        readAttributes: function() {
            console.log(this.toObject());
            console.log(this.toJSON());
            console.log(this.attributes);
            console.log(this);
            // let obj = this.toObject();
            // delete obj.password;
            // return obj;
            return 'obj';
        },

        fullName() {
            return this.firstName + ' ' + this.lastName;
        },

        toJSON() {
            let obj = this.toObject();
            let hidden = sails.config.models.attributes.hidden;
            let readOnly = sails.config.models.attributes.readOnly;

            let merged = _.merge(hidden, readOnly, function(a, b) {
                return _.isArray(a) ? _.union(a, b) : undefined;
            });

            merged.forEach(function(element) {
                delete obj[element];
            }, this);

            return obj;
        },
    },

    beforeUpdate(values, next) {
        if (false === values.hasOwnProperty('password')) return next();
        if (/^\$2[aby]\$[0-9]{2}\$.{53}$/.test(values.password)) return next();

        return HashService.bcrypt.hash(values.password)
            .then(hash => {
                values.password = hash;
                next();
            })
            .catch(next);
    },

    beforeCreate(values, next) {
        if (false === values.hasOwnProperty('password')) return next();

        return HashService.bcrypt.hash(values.password)
            .then(hash => {
                values.password = hash;
                next();
            })
            .catch(next);
    }
};