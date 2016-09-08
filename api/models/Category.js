"use strict";

/**
 * Category
 * @description :: Model for storing Category records
 */

var shortId = require('shortid');
var slug = require('slug');

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
        name: {
            type: 'string',
            unique: true,
            required: true,
            size: 150,
            minLength: 1
        },
        slug: {
            type: 'string',
        },
        description: {
            type: 'string',
            size: 350
        },
        color: {
            type: 'string',
            size: 6
        },
        active: {
            type: 'boolean',
            defaultsTo: true
        },
        createdBy: {
            model: 'user',
            required: true
        },
        fileName: {
            type: 'string',
            size: 20
        },
        datasets: {
            collection: 'dataset',
            via: 'categories'
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => {
        if(values.name){
            values.slug = slug(values.name, {lower: true});    
        }
        next()
    },
    beforeCreate: (values, next) => {
        if(values.name){
            values.slug = slug(values.name, {lower: true});    
        }
        if (_.endsWith(values.image, '/id')) {

            values.image = _.replace(values.url, 'model', 'categories');
            values.image = _.replace(values.image, 'id', values.id);
            values.image = values.image + '/image';
        }

        next();
    }
};
