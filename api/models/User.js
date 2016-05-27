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
            size: 15,
            minLength: 14
        },
        username: {
            type: 'string',
            required: true,
            unique: true,
            alphanumericdashed: true,
            size: 25,
            minLength: 1
        },
        password: {
            type: 'string',
            required: true,
            minLength: 3
        },
        email: {
            type: 'email',
            required: true,
            unique: true,
            email: true,
            size: 250,
            minLength: 5
        },
        firstName: {
            type: 'string',
            defaultsTo: '',
            size: 50,
            minLength: 1
        },
        lastName: {
            type: 'string',
            defaultsTo: '',
            size: 100,
            minLength: 1
        },
        avatar: {
            type: 'string',
            url: true,
            size: 500,
            minLength: 3
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

        fullName() {
            return this.firstName + ' ' + this.lastName;
        },


        toJSON() {
            let obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },
    baseAttributes: {
        username: {
            type: 'string'
        },
        email: {
            type: 'email'
        },
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        avatar: {
            type: 'string'
        },
        organization: {
            type: 'object'
        },
        createdBy: {
            type: 'object'
        },
        files: {
            type: 'object'
        },
        datasets: {
            type: 'object'
        },
    },
    setAttributes() {
        return _.merge({
            password: {
                type: 'string'
            }
        }, this.baseAttributes)
    },
    getAttributes() {
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
        }, this.baseAttributes)
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