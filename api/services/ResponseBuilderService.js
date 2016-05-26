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

const pluralize = require('pluralize');
const _actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

//TODO: Extract common variables on parent class ResponseBuilder, eg. model?
class ResponseBuilder {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        // this.status;
        // this.headers = {};

        // TODO: Find a way to include the correct code & message (eg, CREATED, Resource has been created.)
        this.meta = {
            code: '',
            message: ''
        };
        this.data = [];
        this.links = {};
        this.error = {};

        this._model = _actionUtil.parseModel(this.req);
        this._emptyMeta = _.cloneDeep(this.meta);
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
     * Builds the response body. The subclasses must provide the custom building blocks (meta, error/data, links).
     */
    build() {
        let body;
        let elements = {
            meta: this.meta,
            error: this.error,
            data: this.data,
            links: this.links
        };

        /**
         * Guard clauses
         */

        // if (!_.isInteger(this.status)) new Error('Status must be an integer.');
        // if (!_.isPlainObject(this.headers)) new Error('Headers is not an object.');
        if (!_.isPlainObject(this.meta)) new Error('Meta is not an object.');
        if (!_.isPlainObject(this.links)) new Error('Links is not an object.');
        if (_.isEqual(this.meta, _emptyMeta)) new Error('Meta is empty.');
        if (_.isEmpty(this.links)) new Error('Links is empty.');

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
     * Add one key/value pair to the meta object. To set the entire object at once, do it directly: builder.meta = meta
     */
    addMeta(value) {
        this._addValue(value, this.meta);
        return this; // Allows chaining
    }

    /**
     * Add one key/value pair to the links object. To set the entire object at once, do it directly: builder.links = link
     */
    addLink(value) {
        this._addValue(value, this.links);
        return this; // Allows chaining
    }
}


/**
 * A class that builds a response to a GET request. Subclasses ResponseBuilder, providing its own meta and links objects.
 * Data will be set externally (eg, builder.data = data) in the corresponding response file (eg, responses/ok.js).
 */

class ResponseGET extends ResponseBuilder {
    constructor(req, res, many) {
        super(req, res);

        var _query = '';

        const _fields = this.req.param('fields') ? this.req.param('fields').replace(/ /g, '').split(',') : [];
        const _populate = this.req.param('populate') ? this.req.param('populate').replace(/ /g, '').split(',') : [];
        this._many = many;

        // Don't forget to set 'many' in blueprints/find.js (eg, new Response.ResponseGET(req, res, true);

        if (this._many) {
            const _where = _actionUtil.parseCriteria(this.req);
            const _limit = _actionUtil.parseLimit(this.req);
            const _skip = this.req.param('page') * _limit || _actionUtil.parseSkip(this.req);
            const _sort = _actionUtil.parseSort(this.req);
            const _page = Math.floor(_skip / _limit) + 1;

            _query = this._model.find(null, _fields.length > 0 ? {
                select: _fields
            } : null).where(_where).limit(_limit).skip(_skip).sort(_sort);

            this.meta = _.assign(this.meta, {
                // criteria: _where,
                limit: _limit,
                start: _skip,
                end: _skip + _limit,
                page: _page
            });

            // If a criteria was given, add it to meta
            if (JSON.stringify(_where) != '{}') {
                this.meta = _.assign(this.meta, {
                    criteria: _where
                });
            }

            // Delete the skip query parameter
            var requestQuery = this.req.query;
            delete requestQuery.skip;

            this._model.count(requestQuery).exec(function count(err, cant) {
                // check if no parameters given
                var params = (JSON.stringify(requestQuery) != '{}');
                // If we have &skip or ?skip, we delete it from the url
                var url = this.req.url.replace(/.skip=\d+/g, "");

                const _linkToModel = this.req.host + ':' + this.req.port + url + (params ? '&' : '?') + 'skip=';
                const _previous = (_page > 1 ? _linkToModel + (_skip - _limit) : undefined);
                const _next = (_skip + _limit < cant ? _linkToModel + (_skip + _limit) : undefined);
                const _first = (_page > 1 ? _linkToModel + 0 : undefined);
                const _last = ((_skip + _limit < cant) ? _linkToModel + parseInt((parseFloat(cant) / parseFloat(_limit) * _limit) - 1) : undefined);

                if (_previous) this.links.previous = _previous;
                if (_next) this.links.next = _next;
                if (_first) this.links.first = _first;
                if (_last) this.links.last = _last;
            }.bind(this));
        } else {
            const _pk = _actionUtil.requirePk(this.req);
            const modelName = pluralize(this._model.adapter.identity);
            _query = this._model.find(_pk, _fields.length > 0 ? {
                select: _fields
            } : null);

            this.links = {
                all: this.req.host + ':' + this.req.port + '/' + modelName
            };
        }

        this.findQuery = _.reduce(_.intersection(_populate, this._takeAlias(this._model.associations)), this._populateAlias, _query);
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
    constructor(req, res, methods, headers = {}, count = false) {
        super(req, res);

        // This will be the array containing all the HTTP verbs, eg. [ { GET : { id : { type:string } } } ]
        var methodsArray = [];
        // Key has the function that returns the parameters & value has the HTTP verb
        _.forEach(methods, function(key, methodVerb) {
            //TODO: headers: {?}, we can set it on the model in the getAttributes and setAttributes.
            methodsArray.push({
                "verb": methodVerb,
                "url": this.req.path,
                "parameters": key(this._model)
            });
        });

        this.methods = methodsArray;
    }
}

module.exports = {
    ResponseGET,
    ResponsePOST,
    ResponsePATCH,
    ResponseDELETE,
    ResponseOPTIONS
};