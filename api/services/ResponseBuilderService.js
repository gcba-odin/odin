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
        this.req.options.criteria = req.options.criteria || {};
        this.req.options.criteria.blacklist = ['limit', 'skip', 'sort', 'populate', 'orderBy'];
        // this.status;
        // this.headers = {};

        this._meta = {
            code: '',
            message: ''
        };
        this._data = [];
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
            data: this._data,
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
            if (!_.isPlainObject(this._data) && !_.isArray(this._data)) new Error('Data is not an object or an array.');
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

    meta() {
        return this._meta;
    }

    data(records) {
        return this._data;
    }

    links() {
        return this._links;
    }
}


/**
 * A class that builds a response to a GET request. Subclasses ResponseBuilder, providing its own meta and _links objects.
 * Data will be set externally (eg, builder.data = data) in the corresponding response file (eg, responses/ok.js).
 */

class ResponseGET extends ResponseBuilder {
    constructor(req, res, many) {
        super(req, res);

        this._query = '';
        this._fields = this.req.param('fields') ? this.req.param('fields').replace(/ /g, '').split(',') : [];
        this._includes = this.parseInclude(this.req);
        this.modelName = pluralize(this._model.adapter.identity);

        // Don't forget to set 'many' in blueprints/find.js (eg, new Response.ResponseGET(req, res, true);
        this._many = many;

        if (req.query.include) {
            delete req.query.include;
        }

        if (this._many) {
            this._where = _actionUtil.parseCriteria(this.req);
            this._limit = _actionUtil.parseLimit(this.req);
            this._skip = _actionUtil.parseSkip(this.req) || this.req.param('page') * this._limit;
            // const this._sort = _actionUtil.parseSort(this.req);
            this._sort = this.parseSort(this.req);
            this._page = Math.floor(this._skip / this._limit) + 1;

            // Delete the skip query parameter
            this.requestQuery = this.req.query;
            delete this.requestQuery.skip;

            this._query = this._model.find(null, this._fields.length > 0 ? {
                select: this._fields
            } : null).where(this._where).limit(this._limit).skip(this._skip).sort(this._sort);
            this._query = this.populate(this._query, this._model, this._includes);

            this.countQuery = _.cloneDeep(this.req.query);
            delete this.countQuery.limit;

            this._model.count(this.countQuery).then(function(cant) {
                this._count = cant;
                this._pages = Math.ceil(parseFloat(this._count) / parseFloat(this._limit));
            }.bind(this));
        } else {
            this._pk = _actionUtil.requirePk(this.req);
            this._query = this._model.find(this._pk, this._fields.length > 0 ? {
                select: this._fields
            } : null);
            this._query = this.populate(this._query, this._model, this._includes);
        }

        this.findQuery = this._query;
    }

    addData(value) {
        if (this._many) {
            if (_.isPlainObject(this._data)) this._data = [];
            else if (_.isArray(this._data)) this._data = _.concat(this._data, value);
            else new Error('Data is not an array. It should be, since many is true.');
        } else {
            if (_.isArray(this._data)) this._data = {};
            else if (_.isPlainObject(this._data)) this._addValue(value, this._data);
            else new Error('Data is not an object. It should be, since many is false.');
        }

        return this; // Allows chaining
    }

    /*
     * Builds and returns the 'meta' object (part of the response body)
     */
    meta(records) {
        // If the client is requesting a collection, we'll include the criteria plus pagination data
        if (this._many) {
            this._meta = _.assign(this._meta, {
                // criteria: this._where,
                count: this._count,
                limit: this._limit,
                start: this._skip + 1,
                end: this._skip + this._limit,
                page: this._page,
                pages: this._pages
            });

            // If a criteria was given, add it to meta
            if (!_.isEmpty(this._where)) {
                this._meta = _.assign(this._meta, {
                    criteria: this._where
                });
            }
        }

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

        return this._meta;
    }

    /*
     * Builds and returns the 'links' object (part of the response body)
     */
    links(records) {
        // If the client is requesting a collection, we'll show certain links plus pagination
        if (this._many) {
            // check if no parameters given
            var params = (!_.isEmpty(this.requestQuery));
            // If we have &skip or ?skip, we delete it from the url
            var url = this.req.url.replace(/.skip=\d+/g, "");

            const _skipPlusLimit = this._skip + this._limit;
            const _skipMinusLimit = this._skip - this._limit;
            const _baseLinkToModel = this.req.host + ':' + this.req.port + url + (params ? '&' : '?');
            const _linkToModel = _baseLinkToModel + 'skip=';

            const _previous = (this._page > 1 ? _linkToModel + (this._limit * (this._page - 2)) : undefined);
            const _next = (this._page < this._pages ? _linkToModel + (this._limit * this._page) : undefined);
            const _first = (this._page > 1 ? _linkToModel + 0 : undefined);
            const _last = (this._page < this._pages ? _linkToModel + (this._limit * (this._pages - 1)) : undefined);

            if (_previous) this._links.previous = _previous;
            if (_next) this._links.next = _next;
            if (_first) this._links.first = _first;
            if (_last) this._links.last = _last;

            if (!_.isUndefined(records) && records.length > 0) {
                return this._links;
            } else {
                delete this._links.first;
                delete this._links.last;
                delete this._links.previous;
                delete this._links.next;
                delete this._links.collections;
            }
            return this._links;
        }
        // If the client is requesting a single item, we'll show other links
        else {
            var relations = {};

            _.forEach(this._model.associations, function(association) {
                if (association.type == 'collection') {
                    relations[association.alias] = this.req.host + ':' + this.req.port + '/' + this.modelName + '/' + this._pk + '/' + association.alias;
                }
            }.bind(this));

            !_.isEmpty(relations) ? this._links['collections'] = relations : '';

            this._links = _.assign(this._links, {
                all: this.req.host + ':' + this.req.port + '/' + this.modelName
            });
        }

        return this._links;
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
        var splits = [];
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
                    };
                } else results.full.push(testee);
            });
        }

        this.partials = results.partials;
        return results;
    }

    /*
     * Handles the population of related items and collections
     */
    populate(query, model, includes) {
        // Fully populate non collection items
        _.forEach(model.definition, function(value, key) {
            if (value.foreignKey) {
                query.populate(key).exec(function afterwards(err, populatedRecords) {
                    if (!err) query = populatedRecords;
                    else console.log(err);
                });
            }
        });

        // Fully populate collections
        _.forEach(includes.full, function(element) {
            query.populate(element).exec(function afterwards(err, populatedRecords) {
                if (!err) query = populatedRecords;
                else console.log(err);
            });
        }, this);

        // Partial includes are supported in Waterline, but are adapter dependant
        // Since not many adapters implement them we're doing it by hand
        // TODO: Check if the adapter supports them, to avoid the heavy load of the custom solution

        // Fully populate included partials (will be filtered out later)
        _.forEach(includes.partials, function(value, key) {
            query.populate(key).exec(function afterwards(err, populatedRecords) {
                if (!err) query = populatedRecords;
                else console.log(err);
            });
        }, this);

        return query.then(function(records) {
            // Filter out the partials
            // Each result item
            records.forEach(function(element, j) {
                records[j] = _.transform(element, function(result, value, key) {
                    // Each granular include, gruped by model
                    _.forEach(includes.partials, function(partialValue, partialKey) {
                        if (key === partialKey && _.isArray(element[partialKey])) {
                            // Each collection of included objects
                            element[partialKey].forEach(function(item, k) {
                                // Each included object in the collection
                                _.forEach(item, function(resultValue, resultKey) {
                                    // If it's not listed on the granular includes, delete it
                                    if (partialValue.indexOf(resultKey) === -1) {
                                        delete element[partialKey][k][resultKey];
                                    } else result[partialKey][k] = element[partialKey][k];
                                });
                            });
                        } else result[key] = element[key];
                    });
                }, element);
            });

            return records;
        });
    }
}

class ResponsePOST extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        const _values = _actionUtil.parseValues(this.req);
        this.create = this._model.create(_.omit(_values, 'id'));
    }
    meta(record) {
        _.assign(this._meta = {
            code: sails.config.success.CREATED.code,
            message: sails.config.success.CREATED.message
        });

        return this._meta;
    }

    links(record) {
        const modelName = pluralize(this._model.adapter.identity);

        this._links = {
            record: this.req.host + ':' + this.req.port + '/' + modelName + '/' + record.id
        };

        return this._links;
    }
}

class ResponsePATCH extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        const _pk = _actionUtil.requirePk(this.req);
        const _values = this.parseValues(this.req);

        console.log('On responsePATCH _values is equal to :' + JSON.stringify(_values));
        this.update = this._model.update(_pk, _.omit(_values, 'id'));
    }

    parseValues(req) {
        var mergeDefaults = require('merge-defaults');
        var JSONP_CALLBACK_PARAM = 'callback';

        console.log('Inside custom parse values');
        // Allow customizable blacklist for params NOT to include as values.
        req.options.values = req.options.values || {};
        req.options.values.blacklist = req.options.values.blacklist;

        // Validate blacklist to provide a more helpful error msg.
        var blacklist = req.options.values.blacklist;
        if (blacklist && !_.isArray(blacklist)) {
            throw new Error('Invalid `req.options.values.blacklist`. Should be an array of strings (parameter names.)');
        }

        // Start an array to hold values
        var values;

        // Make an array out of the request body data if it wasn't one already;
        // this allows us to process multiple entities (e.g. for use with a "create" blueprint) the same way
        // that we process singular entities.
        var bodyData = _.isArray(req.body) ? req.body : [req.allParams()];


        // Process each item in the bodyData array, merging with req.options, omitting blacklisted properties, etc.
        var valuesArray = _.map(bodyData, function(element) {
            var values;
            // Merge properties of the element into req.options.value, omitting the blacklist
            values = mergeDefaults(element, _.omit(req.options.values, 'blacklist'));
            // Omit properties that are in the blacklist (like query modifiers)
            values = _.omit(values, blacklist || []);
            // Omit any properties w/ undefined values
            values = _.omit(values, function(p) {
                if (_.isUndefined(p)) {
                    return true;
                }
            });

            // WORKS: values is{"tags":["aWRhpz1","tWRhpz2"],"id":"sWRhpRk"}
            // if key is a model collectio, should transform comma separated to array.
            // TBD: values is{"tags":"aWRhpz1,tWRhpz2,uWRhpz2","id":"sWRhpRk"}

            _.forEach(values, function(value, key) {
                var collection = _.find(this._model.associations, [
                    'alias', key
                ])
                if (!_.isUndefined(collection)) {
                    value = _.split(value, ',')
                    values[key] = value
                }
            }.bind(this));

            // console.log('values.tags is = ' + values.tags);
            // console.log('values is' + JSON.stringify(values));
            return values;
        }.bind(this));

        // If req.body is an array, simply return our array of processed values
        if (_.isArray(req.body)) {
            return valuesArray;
        }

        // Otherwaise grab the first (and only) value from valuesArray
        values = valuesArray[0];

        // Omit jsonp callback param (but only if jsonp is enabled)
        var jsonpOpts = req.options.jsonp && !req.isSocket;
        jsonpOpts = _.isObject(jsonpOpts) ? jsonpOpts : {
            callback: JSONP_CALLBACK_PARAM
        };
        if (jsonpOpts) {
            values = _.omit(values, [jsonpOpts.callback]);
        }

        return values;
    }

    meta(record) {
        if (_.isUndefined(record)) {
            _.assign(this._meta, {
                code: sails.config.errors.NOT_FOUND.code,
                message: sails.config.errors.NOT_FOUND.message
            });
        } else {
            _.assign(this._meta = {
                code: sails.config.success.OK.code,
                message: sails.config.success.OK.message
            });
        }

        return this._meta;
    }

    links(record) {
        const modelName = pluralize(this._model.adapter.identity);

        this._links = {
            all: this.req.host + ':' + this.req.port + '/' + modelName
        };

        return this._links;
    }
}

class ResponseDELETE extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        const _pk = _actionUtil.requirePk(this.req);
        this.destroy = this._model.destroy(_pk);
    }

    meta(record) {
        if (_.isUndefined(record)) {
            _.assign(this._meta, {
                code: sails.config.errors.NOT_FOUND.code,
                message: sails.config.errors.NOT_FOUND.message
            });

            return this._meta;
        }
    }

    links(record) {
        if (_.isUndefined(record)) {
            const modelName = pluralize(this._model.adapter.identity);

            this._links = {
                all: this.req.host + ':' + this.req.port + '/' + modelName
            };

            return this._links;
        }
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

        this._data = methodsArray;
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
            this._meta = {
                code: 'OK',
                message: 'The operation was executed successfully.',
            };
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