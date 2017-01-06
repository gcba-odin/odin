"use strict";

const _actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const _ = require('lodash');

class ParamsProcessor {
    constructor(req, res, many) {
        this.req = req;
        this.res = res;
        // Don't forget to set 'many' in blueprints/find.js (eg, new Response.ResponseGET(req, res, true);
        this._many = many;
        this._model = _actionUtil.parseModel(this.req);
        this.result = {};
    }

    parse() {
        // this.query = '';
        this.fields = this.parseFields(this.req);
        this.include = this.parseInclude();
        this.match = this.parseMatch(this.req);
        this.condition = this.parseCondition(this.req);
        this.where = this.parseCriteria(this.req);
        delete this.where.full.match;
        delete this.where.full.condition;

        this.result = {
            include: this.include,
            fields: this.fields,
            where: this.where,
            pk: this.pk,
            match: this.match,
            condition: this.condition
        };

        if (this._many) {
            this.limit = _actionUtil.parseLimit(this.req) || sails.config.blueprints.defaultLimit;

            this.skip = this.req.param('page') * this.limit || _actionUtil.parseSkip(this.req) || 0;
            // const this.sort = _actionUtil.parseSort(this.req);
            this.sort = this.parseSort(this.req);
            this.page = this.skip !== 0 ? Math.floor(this.skip / this.limit) + 1 : 1;

            // Delete the skip query parameter
            this.requestQuery = this.req.query;
            delete this.requestQuery.skip;

            var manyResult = {
                skip: this.skip,
                sort: this.sort,
                page: this.page,
                limit: this.limit
            }
            _.merge(this.result, manyResult);

        } else {
            var singleResult = {
                pk: this.pk
            }
            _.merge(this.result, singleResult);
        }

        return this.result;
    }

    parseMatch(req) {
        var match = req.param('match');

        switch (_.lowerCase(match)) {
            case 'begins':
                return 'startsWith';
            case 'ends':
                return 'endsWith';
            case '':
                return 'contains';
            case 'exact':
                return 'exact';
            case 'contains':
                return 'contains';
            default:
                return this.res.unprocessableEntity();
        }
    }

    parseCondition(req) {
        var condition = req.param('condition');
        /*if (_.isUndefined(req.user)) {
            return 'and';
        }*/
        switch (condition) {
            case 'AND':
                return 'and';
            case undefined:
                return 'or';
            case 'OR':
                return 'or';
            default:
                return this.res.unprocessableEntity();
        }
    }

    parseCriteria(req) {
        var criteria = this.parseCriteriaComplete(req);
        return criteria;
    }

    /*
     * Parses the 'sort' query param and builds an object with it
     */
    parseSort(req) {
        var sort = req.param('sort') || req.options.sort;
        if (sort !== 'ASC' && sort !== 'DESC' && sort !== undefined) {
            return this.res.unprocessableEntity();
        }
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
    parseInclude() {
        var includes = this.req.param('include') ? this.req.param('include').replace(/ /g, '').split(',') : [];
        var results = {
            // Here go the models that will be included with all their attributes
            full: [],
            // Here, the models that will be included with only the specified attributes.
            // Each model is a key holding an array of attributes.
            partials: {}
        };

        if (includes.length > 0) {
            _.forEach(includes, function(element) {
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

    parseFields() {
        var fields = this.req.param('fields') ? this.req.param('fields').replace(/ /g, '').split(',') : [];
        var results = {
            // Here go the models that will be included with all their attributes
            full: [],
            // Here, the models that will be included with only the specified attributes.
            // Each model is a key holding an array of attributes.
            partials: {}
        };

        if (this.req.query.fields) {
            delete this.req.query.fields;
        }

        if (fields.length > 0) {
            _.forEach(fields, function(element) {
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
    }

    toString() {
        return this.req.query;
    }

    parseCriteriaComplete(req) {
        var deep = {};
        // Allow customizable blacklist for params NOT to include as criteria.
        req.options.criteria = req.options.criteria || {};
        req.options.criteria.blacklist = req.options.criteria.blacklist || ['limit', 'skip', 'sort', 'populate'];

        // Validate blacklist to provide a more helpful error msg.
        var blacklist = req.options.criteria && req.options.criteria.blacklist;

        if (blacklist && !_.isArray(blacklist)) {
            throw new Error('Invalid `req.options.criteria.blacklist`. ' +
                'Should be an array of strings (parameter names.)');
        }

        // Look for explicitly specified `where` parameter.
        var where = req.params.all().where;
        // If `where` parameter is a string, try to interpret it as JSON
        if (_.isString(where)) {
            where = tryToParseJSON(where);
        }

        // If `where` has not been specified, but other unbound parameter variables
        // **ARE** specified, build the `where` option using them.
        if (!where) {
            // Prune params which aren't fit to be used as `where` criteria
            // to build a proper where query
            where = req.params.all();
            _.forEach(where, function(key, val) {
                if (_.indexOf(val, '.') !== -1) {
                    deep[val] = key;
                    delete where[val];
                }
            });
            // Omit built-in runtime config (like query modifiers)
            where = _.omit(where, blacklist || ['limit', 'skip', 'sort']);

            // Omit any params w/ undefined values
            where = _.omit(where, function(p) {
                if (isUndefined(p)) {
                    return true;
                }
            });

            // Omit jsonp callback param (but only if jsonp is enabled)
            var jsonpOpts = req.options.jsonp && !req.isSocket;

            jsonpOpts = _.isObject(jsonpOpts) ? jsonpOpts : {
                callback: 'callback'
            };

            if (jsonpOpts) {
                where = _.omit(where, [jsonpOpts.callback]);
            }
        }

        // Merge w/ req.options.where and return
        where = _.merge({}, req.options.where || {}, where) || undefined;

        return {
            full: where,
            deep: deep
        };
    }

}

module.exports = {
    ParamsProcessor
};
