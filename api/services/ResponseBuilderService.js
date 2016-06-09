"use strict";

/**
 * This is a class that builds a response. It takes in the metadata and data that should go in the response and
 * outputs a properly structured response body (as an object).
 *
 * Can be extended to support setting the response headers and returning the whole response object instead of just the
 * body, thus turning it into a proper response builder (rather than a mere response body builder, like it is now).
 *
 * This class is not meant to be instantiated as is; it's an abstract class. A subclass should provide the missing inputs
 * and configurations needed for a specific use case (eg, a response to a GET request may be nothing like a response to a
 * DELETE request), in order to build an automatically customized response body. The subclass is the one that should be
 * made available for use, via the module.exports object.
 *
 * See also lodash documentation: https://lodash.com/docs
 *
 */

const shortid = require('shortid');
const pluralize = require('pluralize');
const _actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

//TODO: Extract common variables on parent class ResponseBuilder, eg. model?
class ResponseBuilder {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        req.options.criteria = req.options.criteria || {};
        this.req.options.criteria.blacklist = ['limit', 'skip', 'sort', 'populate', 'orderBy'];
        // this.status;
        // this.headers = {};

        // TODO: Find a way to include the correct code & message (eg, CREATED, Resource has been created.)
        this._meta = {
            code: '',
            message: ''
        };
        this.data = [];
        this.error = {};

        this._links = {};
        this._model = _actionUtil.parseModel(this.req);
        this._emptyMeta = _.cloneDeep(this._meta);
        this._takeAlias = _.partial(_.map, _, item => item.alias);
        this._populateAlias = (model, alias) => model.populate(alias);

        this._addValue = function(value, target) {
            if (value && _.isArray(value) && typeof value[0] === 'string') { // Setter only
                if (!_.isPlainObject(target)) new Error('Target is not an object.');
                target[value[0]] = value[1];
            }
        }
    }

    /**
     * Builds the response body. The subclasses must provide the custom building blocks (meta, error/data, _links).
     */
    build() {
        let body;
        let elements = {
            meta: this._meta,
            error: this.error,
            data: this.data,
            links: this._links
        };

        /**
         * Guard clauses
         */

        // if (!_.isInteger(this.status)) new Error('Status must be an integer.');
        // if (!_.isPlainObject(this.headers)) new Error('Headers is not an object.');
        if (!_.isPlainObject(this._meta)) new Error('Meta is not an object.');
        if (!_.isPlainObject(this._links)) new Error('Links is not an object.');
        if (_.isEqual(this._meta, _emptyMeta)) new Error('Meta is empty.');
        if (_.isEmpty(this._links)) new Error('Links is empty.');

        // this.res.set(this.headers);

        /**
         * The actual body building
         */

        if (_.isEmpty(error)) {
            if (!_.isPlainObject(this.data) && !_.isArray(this.data)) new Error('Data is not an object or an array.');
            body = _.omit(elements, 'error');
        } else {
            if (!_.isPlainObject(this.error)) new Error('Error is not an object.');
            body = _.omit(elements, 'data');
        }

        return body;
    }

    /**
     * Getters/Setters
     */

    /*
     addHeader(value) {
     _addValue(value, this.headers);
     return this; // Allows chaining
     }
     */

    /**
     * Add one key/value pair to the meta object. To set the entire object at once, do it directly: builder._meta = meta
     */
    addMeta(value) {
        this._addValue(value, this._meta);
        return this; // Allows chaining
    }

    /**
     * Add one key/value pair to the _links object. To set the entire object at once, do it directly: builder._links = link
     */
    addLink(value) {
        this._addValue(value, this._links);
        return this; // Allows chaining
    }

    links() {
        return this._links;
    }

    meta() {
        return this._meta;
    }
}


/**
 * A class that builds a response to a GET request. Subclasses ResponseBuilder, providing its own meta and _links objects.
 * Data will be set externally (eg, builder.data = data) in the corresponding response file (eg, responses/ok.js).
 */

class ResponseGET extends ResponseBuilder {
    constructor(req, res, many) {
        super(req, res);
        var _query = '';

        const _fields = this.req.param('fields') ? this.req.param('fields').replace(/ /g, '').split(',') : [];

        // Don't forget to set 'many' in blueprints/find.js (eg, new Response.ResponseGET(req, res, true);
        const modelName = pluralize(this._model.adapter.identity);

        this.includes = this.parseInclude(this.req);
        this._many = many;

        if (this.includes.length > 0) {
            delete req.query.include;
        }
        if (this._many) {
            const _where = _actionUtil.parseCriteria(this.req);
            const _limit = _actionUtil.parseLimit(this.req);
            const _skip = this.req.param('page') * _limit || _actionUtil.parseSkip(this.req);
            // const _sort = _actionUtil.parseSort(this.req);
            const _sort = this.parseSort(this.req);
            const _page = Math.floor(_skip / _limit) + 1;

            _query = this._model.find(null, _fields.length > 0 ? {
                select: _fields
            } : null).where(_where).limit(_limit).skip(_skip).sort(_sort);

            this._meta = _.assign(this._meta, {
                // criteria: _where,
                limit: _limit,
                start: _skip,
                end: _skip + _limit,
                page: _page
            });

            // If a criteria was given, add it to meta
            console.log(_where);
            console.log(!_.isEmpty(_where))
            if (!_.isEmpty(_where)) {
                this._meta = _.assign(this._meta, {
                    criteria: _where
                });
            }

            // Delete the skip query parameter
            var requestQuery = this.req.query;
            delete requestQuery.skip;

            this._model.count(requestQuery).exec(function count(err, cant) {
                // check if no parameters given
                var params = (!_.isEmpty(requestQuery));
                // If we have &skip or ?skip, we delete it from the url
                var url = this.req.url.replace(/.skip=\d+/g, "");

                const _linkToModel = this.req.host + ':' + this.req.port + url + (params ? '&' : '?') + 'skip=';
                const _previous = (_page > 1 ? _linkToModel + (_skip - _limit) : undefined);
                const _next = ((Math.abs(_skip - _limit) <= cant) ? ((Math.abs(_skip - _limit) < cant) ? _linkToModel + (_skip + _limit) : _linkToModel + (_skip + 1)) : undefined);
                const _first = (_page > 1 ? _linkToModel + 0 : undefined);
                const _last = ((_skip + _limit < cant) ? _linkToModel + parseInt((parseFloat(cant) / parseFloat(_limit) * _limit) - 1) : undefined);

                if (_previous) this._links.previous = _previous;
                if (_next) this._links.next = _next;
                if (_first) this._links.first = _first;
                if (_last) this._links.last = _last;
            }.bind(this));
            this._links = {
                first: this.req.host + ':' + this.req.port + '/' + modelName + '/first',
                last: this.req.host + ':' + this.req.port + '/' + modelName + '/last',
                count: this.req.host + ':' + this.req.port + '/' + modelName + '/count'
            }
        } else {
            const _pk = _actionUtil.requirePk(this.req);
            _query = this._model.find(_pk, _fields.length > 0 ? {
                select: _fields
            } : null);

            var relations = {};
            _.forEach(this._model.associations, function(association) {
                if (association.type == 'collection') {
                    relations[association.alias] = this.req.host + ':' + this.req.port + '/' + modelName + '/' + _pk + '/' + association.alias
                }
            }.bind(this))
            this._links = {
                all: this.req.host + ':' + this.req.port + '/' + modelName,
            };
            !_.isEmpty(relations) ? this._links['collections'] = relations : ''
        }

        //this.findQuery = _.reduce(_.intersection(_populate, this._takeAlias(this._model.associations)), this._populateAlias, _query);
        this.findQuery = this.populate(_query, this._model, this.includes);
    }

    addData(value) {
        if (this._many) {
            if (_.isPlainObject(this.data)) this.data = [];
            else if (_.isArray(this.data)) this.data = _.concat(this.data, value);
            else new Error('Data is not an array. It should be, since many is true.');
        } else {
            if (_.isArray(this.data)) this.data = {};
            else if (_.isPlainObject(this.data)) this._addValue(value, this.data);
            else new Error('Data is not an object. It should be, since many is false.');
        }

        return this; // Allows chaining
    }
    meta(records) {
        if (!_.isUndefined(records)) {
            //if link to next page is not defined, the content is not paginated
            if (_.isUndefined(this._links.next)) {
                _.assign(this._meta, {
                    code: sails.config.success.OK.code,
                    message: sails.config.success.OK.message
                });
            } else {
                _.assign(this._meta, {
                    code: sails.config.success.PARTIAL_CONTENT.code,
                    message: sails.config.success.PARTIAL_CONTENT.message
                });
            }
        } else {
            _.assign(this._meta, {
                code: sails.config.errors.NOT_FOUND.code,
                message: sails.config.errors.NOT_FOUND.message
            });
        }
        return this._meta
    }

    links(records) {
        if (!_.isUndefined(records) && records.length > 0) {
            return this._links;
        } else {
            delete this._links.first;
            delete this._links.last;
            delete this._links.previous;
            delete this._links.next;
            delete this._links.collections;

            return this._links;
        }
    }

    parseSort(req) {
        var sort = req.param('sort') || req.options.sort;
        var orderBy = req.param('orderBy') || req.options.orderBy;
        if (_.isUndefined(sort) || _.isUndefined(orderBy)) {
            return undefined;
        }
        return {
            [orderBy]: sort
        }
    }

    parseInclude(req) {
        var includes = this.req.param('include') ? this.req.param('include').replace(/ /g, '').split(',') : [];

        if (includes.length > 0) {
            _.forEach(includes, function(element, i) {
                var split = element.split('.');
                if (split.length > 1)
                    includes[i] = split;
            });
        }

        return includes;
    }

    populate(query, model, includes) {
        // Populate one-to-many
        _.forEach(model.definition, function(value, key) {
            if (value.foreignKey) {
                query.populate(key).exec(function afterwards(err, populatedRecords) {
                    if (!err) query = populatedRecords;
                    else console.log(err);
                });
            }
        });

        // Populate one-to-many and many-to-many
        _.forEach(includes, function(element) {
            var modifiers = {};
            var model = element;

            if (_.isArray(element)) {
                modifiers.select = [element[1]];
                model = element[0];
            }

            query.populate(model, modifiers).exec(function afterwards(err, populatedRecords) {
                if (!err) query = populatedRecords;
                else console.log(err);

                // TODO: Check if the modifier actually worked (since it's adapter dependant)
                console.log("++++++++++++++++++++++++++++++++++++++++++++");
                console.log(populatedRecords[0].toJSON());
                console.log("\n++++++++++++++++++++++++++++++++++++++++++++\n");
                console.log("model: " + model);
                console.dir(populatedRecords[0][model]);
                console.log("++++++++++++++++++++++++++++++++++++++++++++\n\n");

                _.forEach(populatedRecords[0][model], function(element, i) {

                    console.log("--------------------------------------------");
                    console.log("element: " + console.dir(element));
                    console.log("asd: " + console.dir(asd));
                    console.log("i: " + i);
                    console.log("populatedRecords: " + console.dir(populatedRecords));
                    console.log('\n (before) populatedRecords[0][model]: ' + console.dir(populatedRecords[0][model]) + '\n');
                    populatedRecords[0][model][i] = _.pick(populatedRecords[0][model][i], modifiers.select[0]);
                    console.log('\n (after) populatedRecords[0][model][i]: ' + console.dir(populatedRecords[0][model][i]) + '\n');
                    console.log("--------------------------------------------");
                });

                //console.log(populatedRecords[0].toJSON());
            });
        }, this);

        return query;
    }
}

class ResponsePOST extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        const _values = _actionUtil.parseValues(this.req);
        this.create = this._model.create(_.omit(_values, 'id'));
    }
}

class ResponsePATCH extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        const _pk = _actionUtil.requirePk(this.req);
        const _values = _actionUtil.parseValues(this.req);
        console.log(_values);
        this.update = this._model.update(_pk, _.omit(_values, 'id'));
    }
}

class ResponseDELETE extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        const _pk = _actionUtil.requirePk(this.req);
        this.destroy = this._model.destroy(_pk)
    }
}

class ResponseOPTIONS extends ResponseBuilder {
    // Constructor get the methods to build the parameters response body
    // Count is jut for checking if the url is /model/count, and sets the response to integer instead of object
    constructor(req, res, methods, headers, count) {
        super(req, res);
        // This will be the array containing all the HTTP verbs, eg. [ { GET : { id : { type:string } } } ]
        var methodsArray = [];
        // Key has the function that returns the parameters & value has the HTTP verb
        _.forEach(methods, function(key, methodVerb) {
            var headers = OptionsMethodsService.getHeaders(methodVerb);

            methodsArray.push({
                "headers": headers,
                "verb": methodVerb,
                "url": this.req.path,
                "parameters": key(this._model)
            });
        }.bind(this));
        this.data = methodsArray;
    }

}

class ResponseQuery extends ResponseBuilder {
    constructor(req, res, sort) {
        super(req, res); {
            const modelName = pluralize(this._model.adapter.identity);

            this._meta = {
                code: sails.config.success.OK.code,
                message: sails.config.success.OK.message
            };

            this._links = {
                all: this.req.host + ':' + this.req.port + '/' + modelName
            };
            this.findQuery = this._model.find({
                limit: 1,
                sort: sort
            });
        }
    }
}

class ResponseCount extends ResponseBuilder {
    constructor(req, res) {
        super(req, res); {
            const modelName = pluralize(this._model.adapter.identity);

            this._links = {
                all: this.req.host + ':' + this.req.port + '/' + modelName
            };
            this.countQuery = this._model.count();
        }
    }
}

module.exports = {
    ResponseGET,
    ResponsePOST,
    ResponsePATCH,
    ResponseDELETE,
    ResponseOPTIONS,
    ResponseQuery,
    ResponseCount
};