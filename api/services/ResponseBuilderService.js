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

        this._addValue = function (value, target) {
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

        this.collections = {};
        
        _.forEach(this._model.associations, function (association) {
            if (association.type === 'collection'){
                this.collections[association.alias] = association;
            }
        }.bind(this));


        // TODO: Extract full and deep filters logic here (ResponseGET, ResponseCOUNT)
        // In addition, make collections a class property
    }

    filterObject(data, deleteKey) {
        for (var key in data) {
            var item = data[key];

            if (key === deleteKey) {
                delete data[key];
            }
            else {
                if (typeof item == "object") {
                    this.filterObject(item, deleteKey);
                }
            }
        }
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
     * Performs count query
     */
    performCountQuery(){
        this._model.count().where(this.params.where.full)
        .then(function (count) {
            this._count = count;
            this.params.pages = Math.ceil(parseFloat(this._count) / parseFloat(this.params.limit));
        }.bind(this))
        .catch(function (err) {
            console.log(err);
        });
    }

    /*
     * Builds and returns the query promise
     */
    findQuery() {
        
        //Multiple results (find)
        if (this._many) {

            // We separate filters into:
            // a)Main model (full filters)
            // b)Nested collections (deep filters)

            // Get "invited" full filters in case there's no req.user
            var frontFullFilters = this.getFrontFullFilters();
            var frontDeepFilters = this.getFrontDeepFilters();

            // Parse user full + deep filters 
            var fullFilters = this.parseFullFilters(this.params.where.full);
            var deepFilters = this.parseDeepFilters(this.params.where.full, this.params.where.deep);
            frontDeepFilters = this.parseDeepFilters({}, frontDeepFilters);

            // Convert full filters to query conditions            
            var fullConditions = this.filtersToConditions(fullFilters, this.params.condition, this._model);
            if (!_.isUndefined(fullConditions.or) && _.isEmpty(fullConditions.or)) {
                fullConditions = {};                  
            }
            var frontFullConditions = this.filtersToAndConditions(frontFullFilters, this._model);

            // Merge both user and "invited" conditions
            _.merge(fullConditions, frontFullConditions);
            this.params.where.full = fullConditions;

            // Now convert deep filters to query conditions (Both user and "invited" filters)
            var deepConditions = {};
            
            this.params.include.remove = [];
                
            // Each nested collection has its corresponding deep conditions
            // Example: {'categories': {slug: 'test', status: 'publishedId'}, 'files': {...}}
            _.forEach(this.collections, function (value, key) {
                // Get collection model
                var keyModel = sails.models[value.collection];
                
                // Get collection conditions
                var keyConditions = this.filtersToConditions(deepFilters[key], this.params.condition, keyModel);
                if (!_.isUndefined(keyConditions.or) && _.isEmpty(keyConditions.or)) {
                    keyConditions = {};                  
                }
                deepConditions[key] = keyConditions;  

                // Merge with collection front conditions
                var keyFrontConditions = this.filtersToAndConditions(frontDeepFilters[key], keyModel);
                _.merge(deepConditions[key], keyFrontConditions);                

                // We need to temporary include collections for populate deep conditions
                // Then, when retrieving the data, removing unnecessary nested collections
                if (!_.isUndefined(keyConditions) && !_.isEmpty(keyConditions)) {
                    if (!_.includes(this.params.include.full, key)) {
                        this.params.include.full.push(key);
                        this.params.include.remove.push(key);   
                    }
                }
            }.bind(this));
            
            //Back to params
            this.params.where.deep = deepConditions;

            //console.log(this.params.where.full);
            //console.log(this.params.where.deep);
            
            this._query = this._model.find()
                .where(this.params.where.full)
                .sort(this.params.sort);

            // NOTE: Waterline populate filters only apply on nested collections.
            // We could only paginate on server if:
            // (a) No deep params are supplied 
            // (b) removeEmptyAssociations is not specified or false (model).  
            if(_.isUndefined(this.params.where.deep) || _.isEmpty(this.params.where.deep) || 
                _.isUndefined(this._model.removeEmptyAssociations) || !this._model.removeEmptyAssociations) {
                
                this._query = this._query.limit(this.params.limit);
                this._query = this._query.skip(this.params.skip);
            
                this.performCountQuery();
            }
        } 
        //Single result (find one)
        else {
            this.params.pk = actionUtil.requirePk(this.req);
            this._query = this._model.find(this.params.pk);
            if(_.isUndefined(this.params.where)) {
                this.params.where = {};
            }    
        }

        this._query = this.populate(this._query, this._model, this.params.include, this.params.where.deep);
        
        return this._query;
    }

    /*
     * Parse full filters
     */
    parseFullFilters(fullFilters){
        //Parse full filters
        var finalFullFilters = {}
        _.forEach(fullFilters, function (value, key) {
            // Not a collection. Eg: "name="
            if(_.isUndefined(this.collections[key])){
                finalFullFilters[key] = value;
            }   
        }.bind(this));

        return finalFullFilters;
    }
    
    /*
     * Parse deep filters
     */
    parseDeepFilters(fullFilters, deepFilters){
        var finalDeepFilters = {};

        //Parse full filters
        _.forEach(fullFilters, function (value, key) {
            //Collection filter: Move to deep filters. Eg: "categories="
            if(!_.isUndefined(this.collections[key])){
                var modelName = this.collections[key].collection;
                var primaryKey = (key + '.' + sails.models[modelName].primaryKey);
                finalDeepFilters[primaryKey] = value;
            }   
        }.bind(this));

        finalDeepFilters = _.merge(deepFilters, finalDeepFilters);

        //Grouping deep filters by collection alias. Eg: {'categories': {id: '', name:''}, 'files': {}}
        finalDeepFilters = this.groupDeepFilters(finalDeepFilters);
            
        return finalDeepFilters;
    }

    /*
     * Group deep filters by collection
     */
    groupDeepFilters(deepFilters){
        //Parse deep filters
        var groupedDeepFilters = {};
        _.forEach(deepFilters, function (value, key) {
            //Eg: categories.name -> collectionName is categories, collectionField is name
            var splittedKey = _.split(key, '.');
            var collectionName = splittedKey[0];
            var collectionField = splittedKey[1];

            if(_.isUndefined(groupedDeepFilters[collectionName])){
                groupedDeepFilters[collectionName] = {}
            }
            groupedDeepFilters[collectionName][collectionField] = value;
        });
        return groupedDeepFilters;
    }

    /*
     * Convert filters into query condition
     */
    filtersToConditions(params, condition, model) {
        return condition === 'or' ? this.filtersToOrConditions(params, model) : this.filtersToAndConditions(params, model);
    }

    /*
     * Convert filters into OR query conditions
     */
    filtersToOrConditions(params, model) {
        return _.transform(params, function (result, val, key) {
            if (val === 'null') val = null;
            if(!_.isUndefined(model.definition[key])){
                if (model.definition[key].type === 'boolean' || val === null) {
                    result.or.push({
                        [key]: val
                    })
                } else {
                    // If the condition is OR we split the values given with comma
                    // And then add it each one of the values as an element of the OR query
                    var values = _.split(val, ',');

                    _.forEach(values, function (value) {
                        result.or.push(_.set({}, key, {
                            [this.params.match]: value
                        }));
                    }.bind(this));
                }
            }
        }.bind(this), {
            or: []
        });
    }
    
    /*
     * Convert filters into AND query conditions
     */
    filtersToAndConditions(params, model) {
        return _.transform(params, function (result, val, key) {
            if (val === 'null') val = null;
            if(!_.isUndefined(model.definition[key])){
                if (model.definition[key].type === 'boolean' || val === null) {
                    result[key]= val;
                } else {
                    // If the condition AND we just replace commas for spaces 
                    // var value = _.replace(val, ',', ' ');
                    if(val.indexOf(',') > 0){
                        result[key] = _.split(val, ',');
                    }
                    else{
                        result[key] = {
                            [this.params.match]: val
                        };    
                    }
                }
            }
        }.bind(this), {});
    }

    /*
     * Get model front filters
     * Example: {status: 'publishedId', deletedAt: null}
     */
    getFrontFullFilters() {
        // If request is from frontend, filter out:
        var fullFilters = {};
        if (_.isUndefined(this.req.user)) {
            fullFilters = this.getFrontFilters(this._model);
            //_.merge(this.params.where.full, modelFrontCond);
        }
        return fullFilters;
    }

    /*
     * Get model related associations front filters
     * Example: {categories.status: 'publishedId', categories.deletedAt: null}
     */
    getFrontDeepFilters() {
        // If request is from frontend, filter out:
        var deepFilters = {};
        _.forEach(this.collections, function (value, key) {
            var associationFilter = this.getFrontFilters(sails.models[value.collection], key);
            _.merge(deepFilters, associationFilter);
        }.bind(this));
        return deepFilters;
    }    

    /*
     * Filters out active, status and deletedAt properties for frontend requests.
     */
    getFrontFilters(model, alias) {
        var frontConditions = {}

        var prefix = '';
        if (!_.isUndefined(alias)) {
            prefix += (alias + '.');
        }

        if (!_.isUndefined(model.attributes['active'])) {
            //Active
            var activeKey = prefix + 'active';
            frontConditions[activeKey] = true;
        }
        if (!_.isUndefined(model.attributes['status'])) {
            //Published status
            var statusKey = prefix + 'status';
            frontConditions[statusKey] = 'qWRhpRV';
        }
        if (!_.isUndefined(model.attributes['deletedAt'])) {
            //Not logically deleted
            var deletedAtKey = prefix + 'deletedAt';
            frontConditions[deletedAtKey] = null;
        }
        return frontConditions;
    }

    /*
     * Builds and returns the query promise
     */
    firstQuery() {
        this._query = this._model.find({
            limit: 1,
            sort: 'createdAt ASC'
        });

        this._query = this.populate(this._query, this._model, this.params.include);
        //this._query = this.select(this._query, this.params.fields);

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

        this._query = this.populate(this._query, this._model, this.params.include);
        //this._query = this.select(this._query, this.params.fields);

        return this._query;
    }

    getDataForFeedQuery() {
        this._query = this._model.find({
            sort: 'updatedAt DESC'
        });

        return this._query;
    }

    contentsQuery(dataset, file, cb) {
        DataStorageService.mongoCount(dataset, file, this.res, function (count) {
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
                this._count < this.params.limit /*this.params.pages <= this.params.page*/) {

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
            if (!_.isUndefined(records) /*&& records.deletedAt === null*/) {
                var relations = {};

                _.forEach(this._model.associations, function (association) {
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

    /*
     * Handles the population of related items and collections
     */
    populate(query, model, includes, deepConditions) {
        // Fully populate non collection items
        _.forEach(model.definition, function (value, key) {
            if (value.foreignKey) {
                query.populate(key);
            }
        });

        if (includes) {
            // Fully populate collections
            if (includes.full) {
                _.forEach(includes.full, function (element) {
                    var conditions = {};
                    if(!_.isUndefined(deepConditions)){
                        if(!_.isUndefined(deepConditions[element])){
                            conditions = deepConditions[element];
                        }
                    }
                    query.populate(element, conditions);
                }, this);
            }
        }
        return query;
    }

    /*
     * Return paginated records based on skip and limit
     */
    paginate(records){
        return _(records).slice(this.params.skip).take(this.params.limit).value();
    }

    /*
     * Remove includes that have been added only for deep conditions
     */
    removeIncludes(records){
        //Get model collections
        return _.map(records, function(item){
            _.forEach(this.params.include.remove, function (include) {
                if(!_.isUndefined(item[include])){
                    //TODO: delete item[include]
                    item[include] = null;
                }
            }.bind(this));
            return item;
        }.bind(this));
    }

    /*
     * Filter records at least one association is empty
     */
    filterAssociations(records){
        //Get model collections

        var collections = {};
        _.forEach(this.collections, function (value, key) {
            var associationCond = this.params.where.deep[key];
            if(!_.isUndefined(associationCond) && !_.isEmpty(associationCond)){
                collections[key] = value;
            }
        }.bind(this));

        //Remove from results if any of the model collections is empty
        return _.filter(records, function (record) {
            var include = true;
            _.forEach(collections, function (value, key) {
                var collectionValue = record[key];
                if(_.isUndefined(collectionValue) || _.isEmpty(collectionValue)){
                    include = false;
                    return;
                }
            });                
            return include;                     
        });
    }

    /*
     * Set count from current records
     */
    count(records){
        this._count = records.length;
        this.params.pages = Math.ceil(parseFloat(this._count) / parseFloat(this.params.limit));
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

        this.update = this._model.update(pk, _values);
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
        var valuesArray = _.map(bodyData, function (element) {
            var values;
            // Merge properties of the element into req.options.value, omitting the blacklist
            values = mergeDefaults(element, _.omit(req.options.values, 'blacklist'));
            // Omit properties that are in the blacklist (like query modifiers)
            values = _.omit(values, blacklist || []);
            // Omit any properties w/ undefined values
            values = _.omit(values, function (p) {
                if (_.isUndefined(p)) {
                    return true;
                }
            });

            //  values is{"tags":"aWRhpz1,tWRhpz2,uWRhpz2","id":"sWRhpRk"}

            _.forEach(values, function (value, key) {
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

        _.forEach(methods, function (key, methodVerb) {
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
        super(req, res);
        {
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

class ResponseCount extends ResponseGET {
    constructor(req, res, many) {
        super(req, res, many);

        const modelName = pluralize(this._model.adapter.identity);

        this._meta = {
            code: sails.config.success.OK.code,
            message: sails.config.success.OK.message
        };
        this._links = {
            all: sails.config.odin.baseUrl + '/' + modelName
        };

        // Get "invited" full filters in case there's no req.user
        var frontFullFilters = this.getFrontFullFilters();
        
        // Parse user full filters 
        var fullFilters = this.parseFullFilters(this.params.where.full);
        
        // Convert full filters to query conditions            
        var fullConditions = this.filtersToConditions(fullFilters, this.params.condition, this._model);
        if (!_.isUndefined(fullConditions.or) && _.isEmpty(fullConditions.or)) {
            fullConditions = {};                  
        }
        var frontFullConditions = this.filtersToAndConditions(frontFullFilters, this._model);

        // Merge both user and "invited" conditions
        _.merge(fullConditions, frontFullConditions);
        this.params.where.full = fullConditions;

        this.countQuery = this._model.count(this.params.where.full);
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
