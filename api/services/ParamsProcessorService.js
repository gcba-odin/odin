"use strict";

const _actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

class ParamsProcessor {
    constructor(req, many) {
        this.req = req;
        // Don't forget to set 'many' in blueprints/find.js (eg, new Response.ResponseGET(req, res, true);
        this._many = many;
        this._model = _actionUtil.parseModel(this.req);
        this.result = {};
    }

    parse() {
        // this.query = '';
        this.fields = this.parseFields(this.req);
        this.include = this.parseInclude(this.req);

        if (this._many) {
            this.match = this.parseMatch(this.req);
            this.condition = this.parseCondition(this.req);
            this.where = this.parseCriteria(this.req, this._model);
            this.limit = _actionUtil.parseLimit(this.req) || sails.config.blueprints.defaultLimit;

            this.skip = this.req.param('page') * this.limit || _actionUtil.parseSkip(this.req) || 0;
            // const this.sort = _actionUtil.parseSort(this.req);
            this.sort = this.parseSort(this.req);
            this.page = this.skip !== 0 ? Math.floor(this.skip / this.limit) + 1 : 1;

            // Delete the skip query parameter
            this.requestQuery = this.req.query;
            delete this.requestQuery.skip;

            this.result = {
                include: this.include,
                fields: this.fields,
                where: this.where,
                limit: this.limit,
                skip: this.skip,
                sort: this.sort,
                page: this.page,
                match: this.match,
                condition: this.condition
            };
        } else {
            this.result = {
                include: this.include,
                fields: this.fields
            };
        }

        return this.result;
    }

    //parse match and parse condition should return error if different condition is given, or just return default value ?
    parseMatch(req) {
        var match = req.param('match');

        switch (_.lowerCase(match)) {
            case 'begins':
                return 'startsWith';
            case 'ends':
                return 'endsWith';
            default:
                return 'contains';
        }
    }

    parseCondition(req) {
        var condition = req.param('condition');
        if (condition === 'AND') {
            return 'and';
        }
        return 'or';
    }

    parseCriteria(req, model) {
        var criteria = _actionUtil.parseCriteria(req);

        // _.forEach(criteria, function(value, key) {
        //     if (!model.schema[key]) delete criteria[key];
        // });

        return criteria;
    }

    /*
     * Parses the 'sort' query param and builds an object with it
     */
    parseSort(req) {
        var sort = req.param('sort') || req.options.sort;
        var orderBy = req.param('orderBy') || req.options.orderBy;

        if (_.isUndefined(sort) || _.isUndefined(orderBy)) {
            return undefined;
        }
        return {
            [orderBy]: sort
        };
    }

    /*
     * Parses the 'include' query param and builds an object with it, to be consumed by populate()
     */
    parseInclude(req) {
        var includes = this.req.param('include') ? this.req.param('include').replace(/ /g, '').split(',') : [];
        var results = {
            full: [], // Here go the models that will be included with all their attributes
            partials: {} // Here, the models that will be included with only the specified attributes. Each model is a key holding an array of attributes.
        };

        if (includes.length > 0) {
            _.forEach(includes, function(element, i) {
                var testee = String(element);

                if (testee.indexOf('.') !== -1) {
                    var split = testee.split('.', 2);

                    if (_.isArray(split) && split.length > 1) {
                        if (_.isArray(results.partials[split[0]])) results.partials[split[0]].push(split[1]);
                        else results.partials[split[0]] = [split[1]];
                    }
                } else results.full.push(testee);
            });

            delete this.req.query.include;
        }

        return results;
    }

    parseFields(req) {
        var fields = this.req.param('fields') ? this.req.param('fields').replace(/ /g, '').split(',') : [];
        var splits = [];
        var results = {
            full: [], // Here go the models that will be included with all their attributes
            partials: {} // Here, the models that will be included with only the specified attributes. Each model is a key holding an array of attributes.
        };

        if (this.req.query.fields) {
            delete this.req.query.fields;
        }

        if (fields.length > 0) {
            _.forEach(fields, function(element, i) {
                var testee = String(element);

                if (testee.indexOf('.') !== -1) {
                    var split = testee.split('.', 2);

                    if (_.isArray(split) && split.length > 1) {
                        if (_.isArray(results.partials[split[0]])) results.partials[split[0]].push(split[1]);
                        else results.partials[split[0]] = [split[1]];

                        results.full.push(split[0]);
                    }
                } else results.full.push(testee);
            });
        }

        return results;

        //return fields;
    }

    toString() {
        return this.req.query;
    }
}

module.exports = {
    ParamsProcessor
};