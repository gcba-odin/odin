"use strict";

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const takeAlias = _.partial(_.map, _, item => item.alias);
const populateAlias = (model, alias) => model.populate(alias);

class ResponseBuilder {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        
        // this.status;
        // this.headers = {};
        this.meta = {
            status: '',
            message: ''
        };
        this.data = [];
        this.links = {};
        this.error = {};
        
        var _many = false;
        var _addValue = function (value, target) {
            if (value && _.isArray(value) && typeof value[0] === 'string') { // Setter only
                if (!_.isPlainObject(target)) new Error('Target is not an object.');
                target[value[0]] = value[1];
            }
        }
        var _emptyMeta = _.cloneDeep(this.meta);
    }
    
    build() {
        let body;
        
        // Guard clauses
        
        // if (!_.isInteger(this.status)) new Error('Status must be an integer.');
        // if (!_.isPlainObject(this.headers)) new Error('Headers is not an object.');
        if (!_.isPlainObject(this.meta)) new Error('Meta is not an object.');
        if (!_.isPlainObject(this.links)) new Error('Links is not an object.');
        if (this.meta === _emptyMeta) new Error('Meta is empty.');
        // if (this.links === {}) new Error('Links is empty.');
        
        // this.res.set(this.headers);
        
        if (error === {}) {
            if (!_.isPlainObject(this.data) && !_.isArray(this.data)) new Error('Data is not an object or an array.');
            body = {meta: this.meta, data: this.data, links: this.links}
        }
        else {
            if (!_.isPlainObject(this.error)) new Error('Error is not an object.');
            body = {meta: this.meta, error: this.error, links: this.links}
        };
        
        return body;
    }
    
   /*
    addHeader(value) {
        _addValue(value, this.headers);
        return this; // Allows chaining
    }
    */
    
    addMeta(value) {
        _addValue(value, this.meta);
        return this; // Allows chaining
    }
    
    addData(value) {
        if (this.many()) {
            if (_.isPlainObject(this.data)) this.data = [];
            else if (_.isArray(this.data)) this.data = _.concat(this.data, value);
            else new Error('Data is not an array. It should be, since many() returns true.');
        }
        else {
            if (_.isArray(this.data)) this.data = {};
            else if (_.isPlainObject(this.data)) _addValue(value, this.data);
            else new Error('Data is not an object. It should be, since many() returns false.');
        }
        
        return this; // Allows chaining
    }
    
    addLink(value) {
        _addValue(value, this.links);
        return this; // Allows chaining
    }
    
    /**
     * Is the client requesting many items or just one? Getter / setter
     */
    many(value) {
        if (value) { // Acts as setter
            _many = _.isBoolean(value) ? value : new Error('many() must receive a boolean.');            
            return this; // Allows chaining
        }
        else return _many; // Acts as getter         
    }
}
 
class GetResponse extends ResponseBuilder {
    constructor(req, res) {
        super(req, res);
            
        this.model = actionUtil.parseModel(this.req);
        this.fields = this.req.param('fields') ? this.req.param('fields').replace(/ /g, '').split(',') : [];
        this.populate = this.req.param('populate') ? this.req.param('populate').replace(/ /g, '').split(',') : [];
        this.findQuery = _.reduce(_.intersection(this.populate, takeAlias(this.model.associations)), populateAlias, this.query);

        if (this.many()) { 
            this.where = actionUtil.parseCriteria(this.req);
            this.limit = actionUtil.parseLimit(this.req);
            this.skip = this.req.param('page') * this.limit || actionUtil.parseSkip(this.req);
            this.sort = actionUtil.parseSort(this.req);
            this.quert = this.model.find(null, this.fields.length > 0 ? {select: this.fields} : null).where(this.where).limit(this.limit).skip(this.skip).sort(this.sort);
            
            this.meta = _.assign(this.meta, {
                criteria: this.where,
                limit: this.limit,
                start: this.skip,
                end: this.skip + this.limit,
                page: Math.floor(this.skip / this.limit)
            });
            
            // TODO: Add links (just like meta was added) ---> then uncomment the empty links check in ResponseBuilder
            this.links = {};
        }
        else {
            this.pk = actionUtil.requirePk(this.req);
            this.query = this.model.find(this.pk, this.fields.length > 0 ? {select: this.fields} : null);
            
            // TODO: Add links (just like meta was added) ---> then uncomment the empty links check in ResponseBuilder
            this.links = {};
        }
    }  
}
 
class PostResponse extends ResponseBuilder {
     constructor(req, res) {
         super(req, res);
         
         // Build own meta and links objects
     }
}

class PatchResponse extends ResponseBuilder {
     constructor(req, res) {
         super(req, res);
     }
}

class DeleteResponse extends ResponseBuilder {
     constructor(req, res) {
         super(req, res);
     }
}

class HeadResponse extends ResponseBuilder {
     constructor(req, res) {
         super(req, res);
     }
}

class OptionsResponse extends ResponseBuilder {
     constructor(req, res) {
         super(req, res);
     }
}

module.exports = {
     GetResponse,
     PostResponse,
     PatchResponse,
     DeleteResponse,
     HeadResponse,
     OptionsResponse
}