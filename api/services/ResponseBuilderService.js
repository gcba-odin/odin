"use strict";

/**
 * This is a class that builds a response. It takes in the metadata and data that should go in the response and
 * outputs a properly structured response body (as an object).
 *
 * Can be extended to support setting the response headers and returning the whole response object
 * instead of just the body, thus turning it into a proper response builder
 * (rather than a mere response body builder, like it is now).
 *
 * This class is not meant to be instantiated as is; it's an abstract class.
 * A subclass should provide the missing inputs and configurations needed for a specific use case
 * (eg, a response to a GET request may be nothing like a response to a DELETE request),
 * in order to build an automatically customized response body.
 * The subclass is the one that should be made available for use, via the module.exports object.
 *
 * See also lodash documentation: https://lodash.com/docs
 *
 */

const pluralize = require('pluralize');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const Processor = require('../services/ParamsProcessorService');
const mergeDefaults = require('merge-defaults');

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
        this._model = actionUtil.parseModel(this.req);
        this._emptyMeta = _.cloneDeep(this._meta);
        this._takeAlias = _.partial(_.map, _, item => item.alias);
        this._populateAlias = (model, alias) => model.populate(alias);

        this._addValue = function(value, target) {
            if (value && _.isArray(value) && typeof value[0] === 'string') { // Setter only
                if (!_.isPlainObject(target)) return new Error('Target is not an object.');
                target[value[0]] = value[1];
            }
        };

        LogService.winstonLog('silly', 'Request', {
            ip: req.ip,
            headers: req.headers,
            body: req.body,
            parameters: req.params
        });

    }

    /**
     * Builds the response body. The subclasses must provide the custom building blocks (meta, error/data, _links).
     */
    build() {
        let body;
        const elements = {
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
        if (!_.isPlainObject(this._meta)) return new Error('Meta is not an object.');
        if (!_.isPlainObject(this._links)) return new Error('Links is not an object.');
        if (_.isEqual(this._meta, _emptyMeta)) return new Error('Meta is empty.');
        if (_.isEmpty(this._links)) return new Error('Links is empty.');

        // this.res.set(this.headers);

        /**
         * The actual body building
         */

        if (_.isEmpty(error)) {
            if (!_.isPlainObject(this._data) && !_.isArray(this._data))
                return new Error('Data is not an object or an array.');
            body = _.omit(elements, 'error');
        } else {
            if (!_.isPlainObject(this.error))
                return new Error('Error is not an object.');
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
     * Add one key/value pair to the meta object.
     * To set the entire object at once, do it directly: builder._meta = meta
     */
    addMeta(value) {
        this._addValue(value, this._meta);
        return this; // Allows chaining
    }

    /**
     * Add one key/value pair to the _links object.
     * To set the entire object at once, do it directly: builder._links = link
     */
    addLink(value) {
        this._addValue(value, this._links);
        return this; // Allows chaining
    }

    meta() {
        return this._meta;
    }

    data() {
        return this._data;
    }

    links() {
        return this._links;
    }
}


/**
 * A class that builds a response to a GET request.
 * Subclasses ResponseBuilder, providing its own meta and _links objects.
 * Data will be set externally (eg, builder.data = data)
 * in the corresponding response file (eg, responses/ok.js).
 */

class ResponseGET extends ResponseBuilder {
    constructor(req, res, many) {
        super(req, res);

        this.params = new Processor.ParamsProcessor(req, res, many).parse();
        this.modelName = pluralize(this._model.adapter.identity);
        this._query = '';
        // Don't forget to set 'many' in blueprints/find.js (eg, new Response.ResponseGET(req, res, true);
        this._many = many;
    }

    addData(value) {
        if (this._many) {
            if (_.isPlainObject(this._data)) this._data = [];
            else if (_.isArray(this._data)) this._data = _.concat(this._data, value);
            else return new Error('Data is not an array. It should be, since many is true.');
        } else {
            if (_.isArray(this._data)) this._data = {};
            else if (_.isPlainObject(this._data)) this._addValue(value, this._data);
            else return new Error('Data is not an object. It should be, since many is false.');
        }

        return this; // Allows chaining
    }

    /*
     * Builds and returns the query promise
     */
    findQuery() {
        var collections = [];
        var collectionsFilter = {};

        _.forEach(this._model.associations, function(association) {
            if (association.type === 'collection')
                collections.push(association.alias);
        });

        if (this._many) {
            if (!_.isUndefined(this.params.where.full) && !_.isEmpty(this.params.where.full)) {

                if (this.params.condition === 'or') {

                    this.params.where.full = _.transform(this.params.where.full, function(result, val, key) {
                        if (collections.indexOf(key) === -1) {

                            if (this._model.definition[key].type === 'boolean') {
                                result.or.push({
                                    [key]: val
                                })
                            } else {
                                // If the condition is or we split the values given with comma
                                // And then add it each one of the values as an element of the OR query
                                var values = _.split(val, ',');
                                _.forEach(values, function(value) {
                                    result.or.push(_.set({}, key, {
                                        [this.params.match]: value
                                    }));
                                }.bind(this));
                            }
                        }
                        //if it is a collection  we add it to the include object,
                        // and store it in the collection filter array.
                        else {
                            this.params.include.full.push(key);
                            collectionsFilter[key] = val;
                        }

                    }.bind(this), {
                        or: []
                    });
                } else {

                    // Condition is AND
                    this.params.where.full = _.transform(this.params.where.full, function(result, val, key) {

                        if (collections.indexOf(key) === -1) {

                            var value = _.replace(val, ',', ' ');

                            result[key] = {
                                [this.params.match]: value
                            };
                        }
                        //if it is a collection  we add it to the include object,
                        // and store it in the collection filter array.
                        else {
                            this.params.include.full.push(key);
                            collectionsFilter[key] = val;
                        }
                    }.bind(this), {});
                }
            }

            if (!_.isUndefined(this.params.where.full.or) && _.isEmpty(this.params.where.full.or)) {
                this.params.where.full = {};
            }
            // Only find not deleted records
            _.merge(this.params.where.full, {
                deletedAt: null
            });

            this._query = this._model.find()
                .where(this.params.where.full)
                .limit(this.params.limit)
                .skip(this.params.skip)
                .sort(this.params.sort);

            this._model.count().where(this.params.where.full)
                .then(function(cant) {
                    this._count = cant;
                    this.params.pages = Math.ceil(parseFloat(this._count) / parseFloat(this.params.limit));
                }.bind(this));
        } else {

            this.params.pk = actionUtil.requirePk(this.req);

            this._query = this._model.find(this.params.pk);
        }

        // this._query = this.select(this._query, this.params.fields);
        this._query = this.populate(this._query, this._model, this.params.include);

        if (!_.isEmpty(collectionsFilter)) {
            this._query = this.filter(this._query, collectionsFilter);
        }

        //deep association filters
        if (!_.isUndefined(this.params.where) && !_.isEmpty(this.params.where.deep)) {
            this._query = this.deepFilter(this._query, this.params.where.deep);
        }

        this._query = this.select(this._query, this.params.fields);

        return this._query;
    }

    /*
     * Builds and returns the query promise
     */
    firstQuery() {
        this._query = this._model.find({
            limit: 1,
            sort: 'createdAt ASC'
        });

        // this._query = this.select(this._query, this.params.fields);
        this._query = this.populate(this._query, this._model, this.params.include);
        this._query = this.select(this._query, this.params.fields);

        return this._query;
    }

    /*
     * Builds and returns the query promise
     */
    lastQuery() {
        this._query = this._model.find({
            limit: 1,
            sort: 'createdAt DESC'
        });

        // this._query = this.select(this._query, this.params.fields);
        this._query = this.populate(this._query, this._model, this.params.include);
        this._query = this.select(this._query, this.params.fields);

        return this._query;
    }

    getDataForFeedQuery() {
        this._query = this._model.find({
            sort: 'updatedAt DESC'
        });

        return this._query;
    }

    contentsQuery(dataset, file, cb) {
        DataStorageService.mongoCount(dataset, file, this.res, function(count) {
            this._count = count;
            this.params.pages = Math.ceil(parseFloat(this._count) / parseFloat(this.params.limit));

            FileContentsService.mongoContents(dataset, file, this.params.limit, this.params.skip, this.res, cb);
        }.bind(this));
    }

    /*
     * Builds and returns the 'meta' object (part of the response body)
     */
    meta(records) {
        // If the client is requesting a collection, we'll include the criteria plus pagination data
        if (this._many) {
            var skipLimit = this.params.skip + this.params.limit;

            this._meta = _.assign(this._meta, {
                // criteria: this._where,
                count: this._count,
                limit: this.params.limit,
                start: this.params.skip + 1,
                end: skipLimit > this._count ? this._count : skipLimit,
                page: this.params.page,
                pages: this.params.pages
            });

            // If a criteria was given, add it to meta
            if (!_.isEmpty(this._where)) {
                this._meta = _.assign(this._meta, {
                    criteria: this.params.where
                });
            }
        }

        if (!_.isUndefined(records)) {
            //if link to next page is not defined, the content is not paginated
            if (_.isUndefined(this.params.pages) ||
                this._count < this.params.limit /*this.params.pages <= this.params.page*/ ) {

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
            // If we have &skip or ?skip, we delete it from the url
            var url = this.req.url.replace(/.skip=\d+/g, "");

            const _baseLinkToModel = sails.config.odin.baseUrl + url + (url.indexOf('?') === -1 ? '?' : '&');
            const _linkToModel = _baseLinkToModel + 'skip=';

            const _previous = (this.params.page > 1 ? _linkToModel +
                (this.params.limit * (this.params.page - 2)) : undefined);

            const _next = ((this.params.pages === 1 && this._count > this.params.limit) ||
                this.params.page < this.params.pages ? _linkToModel +
                (this.params.limit * this.params.page) : undefined);

            const _first = (this.params.page > 1 ? _linkToModel + 0 : undefined);

            const _last = (this.params.page < this.params.pages ?
                _linkToModel + (this.params.limit * (this.params.pages - 1)) : undefined);

            if (_previous) this._links.previous = _previous;
            if (_next) this._links.next = _next;
            if (_first) this._links.first = _first;
            if (_last) this._links.last = _last;

            this._links = _.assign(this._links, {
                firstItem: sails.config.odin.baseUrl + '/' + this.modelName + '/first',
                lastItem: sails.config.odin.baseUrl + '/' + this.modelName + '/last',
                all: sails.config.odin.baseUrl + '/' + this.modelName
            });

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
            if (!_.isUndefined(records) && records.deletedAt === null) {
                var relations = {};

                _.forEach(this._model.associations, function(association) {
                    if (association.type === 'collection') {
                        relations[association.alias] =
                            sails.config.odin.baseUrl + '/' +
                            this.modelName + '/' + this.params.pk + '/' + association.alias;
                    }
                }.bind(this));

                if (!_.isEmpty(relations)) this._links.collections = relations;
            }

            this._links = _.assign(this._links, {
                all: sails.config.odin.baseUrl + '/' + this.modelName
            });
        }

        return this._links;
    }

    filter(query, filters) {
        query.then(function(records) {
            // Variable where we'll save all the indexes to be removed
            var toRemove = [];

            records.forEach(function(element, j) {
                records[j] = _.transform(element, function(result, value, key) {
                    if (!_.isUndefined(filters[key])) {
                        // get the ids of the collection filtered
                        var elementsId = _.map(element[key], function(item) {
                            return item.id;
                        });
                        var filter = _.split(filters[key], ',');
                        // if it doesnt fulfill the filter,
                        // we add it to the array which will remove the element from the response

                        // With the or condition, we only need one match
                        if (this.params.condition === 'or') {
                            if (_.size(_.intersection(elementsId, filter)) === 0) {
                                toRemove.push(j);
                            }
                            // with the AND condition, we need that all matches
                        } else {
                            if (_.size(_.intersection(elementsId, filter)) !== _.size(filter)) {
                                toRemove.push(j);
                            }
                        }
                    }
                }.bind(this), element);
            }.bind(this));
            // pull out of the final records all the records which didnt fulfill the filter
            _.pullAt(records, toRemove);
            // with some of the records deleted, we need to update the count
            this._count = _.size(records);
            this.params.pages = Math.ceil(parseFloat(this._count) / parseFloat(this.params.limit));

            return records;
        }.bind(this));

        return query;
    }

    deepFilter(query) {
        query.then(function(records) {
            // Variable where we'll save all the indexes to be removed
            var toRemove = [];
            var deepFilters = {};
            // ?category.name=Gobierno
            _.forEach(this.params.where.deep, function(value, key) {
                var splittedKey = _.split(key, '.');
                var model = splittedKey[0];

                //Split every filter on an array
                value = value.match(/('[ áéíóúa-zA-Z,1-9 ]+'|[ áéíóúa-zA-Z1-9 ]+)/g);

                //Sanitize the escaped \'
                var sanitizedValue = this.sanitizeSimpleComma(value);

                deepFilters[model] = {
                    attribute: splittedKey[1],
                    values: sanitizedValue
                };
                // deepFilters = { category: { attribute: 'name', value: '[Filter1, Filter2]' } }
            }.bind(this));

            records.forEach(function(element, j) {

                records[j] = _.transform(element, function(result, value, key) {
                    // If the field is on the filters object, we check if it fullfill the filter
                    if (!_.isUndefined(deepFilters[key])) {
                        // if the value filtered is undefined, or its different than the filter we remove it from query
                        if (_.isUndefined(value) ||
                            this.compareFilters(deepFilters[key].values, value[deepFilters[key].attribute])) {
                            toRemove.push(j);
                        }
                    }
                }.bind(this), element);
            }.bind(this));
            // pull out of the final records all the records which didnt fulfill the filter
            _.pullAt(records, toRemove);
            // with some of the records deleted, we need to update the count
            this._count = _.size(records);
            this.params.pages = Math.ceil(parseFloat(this._count) / parseFloat(this.params.limit));

            return records;
        }.bind(this));

        return query;
    }

    sanitizeSimpleComma(array) {
        return _.map(array, function(each) {
            return _.replace(each, new RegExp("\'", "g"), '');
        });
    }

    compareFilters(filters, value) {
        //Removed spaces to compare filter with value
        value = _.replace(value, / /g, '');

        var found = (_.find(filters, function(filterValue) {
            filterValue = _.replace(filterValue, / /g, '');

            return filterValue === value;
        }));

        return (found === undefined) ? true : false;
    }

    select(query, fields) {
        query.then(function(records) {
            // Filter out the partials
            // Each result item
            records.forEach(function(element, j) {
                records[j] = _.transform(element, function(result, value, key) {
                    // Each granular field
                    _.forEach(fields.partials, function(partialValue, partialKey) {
                        if (key === partialKey && _.isObject(element[partialKey])) {
                            // Each object in the collection
                            _.forEach(element[partialKey], function(resultValue, resultKey) {
                                // If it's not listed in the granular fields, delete it
                                if (partialValue.indexOf(resultKey) === -1) {
                                    delete element[partialKey][resultKey];
                                } else result[partialKey] = element[partialKey];
                            });
                        } else delete element[key];
                    });
                }, element);
            });

            return records;
        });

        return query;
    }

    /*
     * Handles the population of related items and collections
     */
    populate(query, model, includes) {
        // Fully populate non collection items
        _.forEach(model.definition, function(value, key) {
            if (value.foreignKey) {
                query.populate(key);
            }
        });

        if (includes) {
            // Fully populate collections
            if (includes.full) {
                _.forEach(includes.full, function(element) {
                    query.populate(element);
                }, this);
            }

            // Partial includes are supported in Waterline, but are adapter dependant
            // Since not many adapters implement them we're doing it by hand
            // TODO: Check if the adapter supports them, to avoid the heavy load of the custom solution

            // Fully populate included partials (will be filtered out later)
            if (includes.partials) {
                _.forEach(includes.partials, function(value, key) {
                    try {
                        query.populate(key);
                    } catch (err) {
                        var links = {
                            all: sails.config.odin.baseUrl + '/' + this.modelName
                        };

                        if (!_.isUndefined(this.params.pk)) {
                            links.record = sails.config.odin.baseUrl + '/' + this.modelName +
                                '/' + this.params.pk;
                        }

                        return this.res.badRequest(links);
                    }
                }.bind(this), this);

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

                                            // If it's not listed in the granular includes, delete it
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
            } else return query;
        }
        return query;
    }
}

class ResponsePOST extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        const _values = actionUtil.parseValues(this.req);

        this.create = this._model.create(_.omit(_values, 'id'));
    }

    meta() {
        _.assign(this._meta = {
            code: sails.config.success.CREATED.code,
            message: sails.config.success.CREATED.message
        });

        return this._meta;
    }

    links(record) {
        const modelName = pluralize(this._model.adapter.identity);

        this._links = {
            record: sails.config.odin.baseUrl + '/' + modelName + '/' + record.id,
            all: sails.config.odin.baseUrl + '/' + modelName
        };

        return this._links;
    }
}

class ResponsePATCH extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        const _values = this.parseValues(this.req);
        var pk = actionUtil.requirePk(this.req);

        this.update = this._model.update(pk, _.omit(_values, 'id'));
    }

    parseValues(req) {
        var JSONP_CALLBACK_PARAM = 'callback';

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

            //  values is{"tags":"aWRhpz1,tWRhpz2,uWRhpz2","id":"sWRhpRk"}

            _.forEach(values, function(value, key) {
                var collection = _.find(this._model.associations, [
                    'alias', key
                ]);

                if (!_.isUndefined(collection) && collection.type === 'collection') {

                    if (value.indexOf(',') !== -1) {
                        value = _.split(value, ',');
                        values[key] = value;
                    }
                }
            }.bind(this));

            return values;
        }.bind(this));

        // If req.body is an array, simply return our array of processed values
        if (_.isArray(req.body)) {
            return valuesArray;
        }

        // Otherwise grab the first (and only) value from valuesArray
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
            all: sails.config.odin.baseUrl + '/' + modelName,
            record: sails.config.odin.baseUrl + '/' + modelName + '/' + record.id
        };

        return this._links;
    }
}

class ResponseDELETE extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);

        var pk = actionUtil.requirePk(this.req);

        this.destroy = this._model.destroy(pk);
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
                all: sails.config.odin.baseUrl + '/' + modelName
            };

            return this._links;
        }
    }
}

class ResponseOPTIONS extends ResponseBuilder {
    // Constructor get the methods to build the parameters response body
    // Count is jut for checking if the url is /model/count, and sets the response to integer instead of object
    constructor(req, res, many) {
        super(req, res);
        this._many = many;

        if (!this._many) {
            var pk = actionUtil.requirePk(this.req);

            this._query = this._model.find(pk);
        }
    }

    getMethods(methods) {
        // This will be the array containing all the HTTP verbs, eg. [ { GET : { id : { type:string } } } ]
        var methodsArray = [];
        // Key has the function that returns the parameters & value has the HTTP verb

        _.forEach(methods, function(key, methodVerb) {
            var headers = OptionsMethodService.getHeaders(methodVerb);

            methodsArray.push({
                "headers": headers,
                "verb": methodVerb,
                "endpoint": this.req.path,
                "parameters": key(this._model)
            });
        }.bind(this));

        return methodsArray;
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
                all: sails.config.odin.baseUrl + '/' + modelName
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
        super(req, res);

        const modelName = pluralize(this._model.adapter.identity);

        this._meta = {
            code: sails.config.success.OK.code,
            message: sails.config.success.OK.message
        };
        this._links = {
            all: sails.config.odin.baseUrl + '/' + modelName
        };
        this.countQuery = this._model.count();
    }
}

class ResponseSearch extends ResponseGET {
    constructor(req, res, many) {
        super(req, res, many);

        var model = sails.models[req.options.model];
        var query = req.param('query');

        if (!query) return res.badRequest(null, {
            message: 'You should specify a "query" parameter!'
        });

        this.model = model;

        this.params.where = _.transform(model.definition, function(result, val, key) {
            // Check if the field is a string, and if is set to be searchable on the model
            if (val.type === 'string' && model.searchables.indexOf(key) !== -1) {

                if (this.params.condition === 'and') {
                    query = _.replace(query, ',', ' ');
                    result.or.push(_.set({}, key, {
                        'contains': query
                    }));
                }
                // The condition is OR
                else {
                    query = _.split(query, ',');
                    // if (_.isArray(query)) {
                    _.forEach(query, function(value) {
                        result.or.push(_.set({}, key, {
                            [this.params.match]: value
                        }));
                    }.bind(this));
                    // } else {
                    // result.or.push(_.set({}, key, {
                    // [this.params.match]: query
                    // }))
                    // }
                }
            }
        }.bind(this), {
            or: []
        });
    }

    /*
     * Builds and returns the query promise
     */
    searchQuery() {
        this._query = this.model.find()
            .where(this.params.where)
            .limit(this.params.limit)
            .skip(this.params.skip)
            .sort(this.params.sort);

        this.model.count().where(this.params.where)
            .then(function(cant) {
                this._count = cant;
                this.params.pages = Math.ceil(parseFloat(this._count) / parseFloat(this.params.limit));
            }.bind(this))
            .catch(function(err) {
                console.error(err);
            });

        this._query = this.populate(this._query, this.model, this.params.include);

        return this._query;
    }
}

module.exports = {
    ResponseGET,
    ResponsePOST,
    ResponsePATCH,
    ResponseDELETE,
    ResponseOPTIONS,
    ResponseQuery,
    ResponseCount,
    ResponseSearch
};