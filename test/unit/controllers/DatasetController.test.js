//-- test/unit/controllers/DatasetController.test.js
'use strict';

require('sails-test-helper');

const chai = require('chai');
const assert = chai.assert;
const shortid = require('shortid');
var datasetId;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));


/*
 * All Datasets
 */

describe('All Datasets', function() {
    describe('- GET /datasets', function() {
        it('- Should get all datasets', function(done) {
            request.get('/datasets')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    assert.property(result.body.meta, 'count');
                    assert.isNumber(result.body.meta.count);

                    assert.property(result.body.meta, 'limit');
                    assert.isNumber(result.body.meta.limit);

                    assert.property(result.body.meta, 'start');
                    assert.isNumber(result.body.meta.start);

                    assert.property(result.body.meta, 'end');
                    assert.isNumber(result.body.meta.end);

                    assert.property(result.body.meta, 'page');
                    assert.isNumber(result.body.meta.page);

                    assert.property(result.body.meta, 'pages');
                    assert.isNumber(result.body.meta.pages);

                    assert.isAtMost(result.body.meta.end, result.body.meta.count);
                    assert.isAtMost(result.body.meta.page, result.body.meta.pages);

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/datasets/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/datasets/last');

                    if (result.body.data.length > 0) {
                        result.body.data.forEach(function(element) {
                            assert.property(element, 'id');
                            assert.isString(element.id);
                            assert.ok(shortid.isValid(element.id));

                            assert.property(element, 'name');
                            assert.isString(element.name);

                            assert.property(element, 'description');
                            if (element.description) assert.isString(element.description);

                            assert.property(element, 'notes');
                            if (element.notes) assert.isString(element.notes);

                            assert.property(element, 'visible');
                            assert.isBoolean(element.visible);

                            assert.property(element, 'starred');
                            assert.isBoolean(element.starred);

                            assert.property(element, 'optional1');
                            assert.property(element, 'optional2');
                            assert.property(element, 'optional3');
                            assert.property(element, 'optional4');
                            assert.property(element, 'optional5');
                            assert.property(element, 'optional6');
                            assert.property(element, 'optional7');
                            assert.property(element, 'optional8');
                            assert.property(element, 'optional9');
                            assert.property(element, 'optional10');

                            assert.property(element, 'status');
                            assert.isObject(element.status);

                            assert.property(element, 'owner');
                            assert.isObject(element.owner);

                            assert.property(element, 'createdBy');
                            // assert.isObject(element.createdBy);

                            assert.property(element, 'createdAt');
                            assert.property(element, 'updatedAt');
                        }, this);
                    }

                    err ? done(err) : done();
                });
        });
    });

    // Pagination

    describe('- GET /datasets?limit=2', function() {
        it('- Should get the first two datasets', function(done) {
            request.get('/datasets?limit=2')
                .set('Accept', 'application/json')
                .expect(206)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'PARTIAL_CONTENT');

                    assert.property(result.body.meta, 'count');
                    assert.isNumber(result.body.meta.count);

                    assert.property(result.body.meta, 'limit');
                    assert.isNumber(result.body.meta.limit);
                    assert.equal(result.body.meta.limit, 2);

                    assert.property(result.body.meta, 'start');
                    assert.isNumber(result.body.meta.start);
                    assert.equal(result.body.meta.start, 1);

                    assert.property(result.body.meta, 'end');
                    assert.isNumber(result.body.meta.end);
                    assert.equal(result.body.meta.end, 2);

                    assert.property(result.body.meta, 'page');
                    assert.isNumber(result.body.meta.page);
                    assert.equal(result.body.meta.page, 1);

                    assert.property(result.body.meta, 'pages');
                    assert.isNumber(result.body.meta.pages);

                    assert.isAtMost(result.body.meta.end, result.body.meta.count);
                    assert.isAtMost(result.body.meta.page, result.body.meta.pages);

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 2);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'next');
                    assert.isString(result.body.links.next);
                    assert.endsWith(result.body.links.next, 'datasets?limit=2&skip=2');

                    assert.property(result.body.links, 'last');
                    assert.isString(result.body.links.last);
                    assert.endsWith(result.body.links.last, 'datasets?limit=2&skip=4');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/datasets/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/datasets/last');

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets?limit=2&skip=2', function() {
        it('- Should get the next page', function(done) {
            request.get('/datasets?limit=2&skip=2')
                .set('Accept', 'application/json')
                .expect(206)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'PARTIAL_CONTENT');

                    assert.property(result.body.meta, 'count');
                    assert.isNumber(result.body.meta.count);

                    assert.property(result.body.meta, 'limit');
                    assert.isNumber(result.body.meta.limit);
                    assert.equal(result.body.meta.limit, 2);

                    assert.property(result.body.meta, 'start');
                    assert.isNumber(result.body.meta.start);
                    assert.equal(result.body.meta.start, 3);

                    assert.property(result.body.meta, 'end');
                    assert.isNumber(result.body.meta.end);
                    assert.equal(result.body.meta.end, 4);

                    assert.property(result.body.meta, 'page');
                    assert.isNumber(result.body.meta.page);
                    assert.equal(result.body.meta.page, 2);

                    assert.property(result.body.meta, 'pages');
                    assert.isNumber(result.body.meta.pages);

                    assert.isAtMost(result.body.meta.end, result.body.meta.count);
                    assert.isAtMost(result.body.meta.page, result.body.meta.pages);

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 2);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'previous');
                    assert.isString(result.body.links.previous);
                    assert.endsWith(result.body.links.previous, 'datasets?limit=2&skip=0');

                    assert.property(result.body.links, 'next');
                    assert.isString(result.body.links.next);
                    assert.endsWith(result.body.links.next, 'datasets?limit=2&skip=4');

                    assert.property(result.body.links, 'first');
                    assert.isString(result.body.links.first);
                    assert.endsWith(result.body.links.first, 'datasets?limit=2&skip=0');

                    assert.property(result.body.links, 'last');
                    assert.isString(result.body.links.last);
                    assert.endsWith(result.body.links.last, 'datasets?limit=2&skip=4');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/datasets/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/datasets/last');

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets?limit=2&skip=4', function() {
        it('- Should get the last datasets', function(done) {
            request.get('/datasets?limit=2&skip=4')
                .set('Accept', 'application/json')
                .expect(206)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {

                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'PARTIAL_CONTENT');

                    assert.property(result.body.meta, 'count');
                    assert.isNumber(result.body.meta.count);

                    assert.property(result.body.meta, 'limit');
                    assert.isNumber(result.body.meta.limit);
                    assert.equal(result.body.meta.limit, 2);

                    assert.property(result.body.meta, 'start');
                    assert.isNumber(result.body.meta.start);
                    assert.equal(result.body.meta.start, 5);

                    assert.property(result.body.meta, 'end');
                    assert.isNumber(result.body.meta.end);
                    assert.equal(result.body.meta.end, 5);

                    assert.property(result.body.meta, 'page');
                    assert.isNumber(result.body.meta.page);
                    assert.equal(result.body.meta.page, 3);

                    assert.property(result.body.meta, 'pages');
                    assert.isNumber(result.body.meta.pages);

                    assert.isAtMost(result.body.meta.end, result.body.meta.count);
                    assert.isAtMost(result.body.meta.page, result.body.meta.pages);

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'previous');
                    assert.isString(result.body.links.previous);
                    assert.endsWith(result.body.links.previous, 'datasets?limit=2&skip=2');

                    assert.property(result.body.links, 'first');
                    assert.isString(result.body.links.first);
                    assert.endsWith(result.body.links.first, 'datasets?limit=2&skip=0');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/datasets/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/datasets/last');

                    err ? done(err) : done();
                });
        });
    });

    // Filters

    describe('- GET /datasets?name=Dataset 1', function() {
        it('- Should get the first dataset', function(done) {
            request.get('/datasets?name=Dataset 1')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 1);

                    assert.property(result.body.data[0], 'id');
                    assert.isString(result.body.data[0].id);
                    assert.ok(shortid.isValid(result.body.data[0].id));
                    assert.equal(result.body.data[0].id, 'sWRhpRk');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Dataset 1');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets?name=Dataset 1&status.name=Draft', function() {
        it('- Should get one dataset', function(done) {
            request.get('/datasets?name=Dataset 1&status.name=Draft')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 1);

                    assert.property(result.body.data[0], 'id');
                    assert.isString(result.body.data[0].id);
                    assert.ok(shortid.isValid(result.body.data[0].id));
                    assert.equal(result.body.data[0].id, 'sWRhpRk');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Dataset 1');

                    assert.property(result.body.data[0], 'status');
                    assert.isObject(result.body.data[0].status);
                    assert.equal(result.body.data[0].status.name, 'Draft');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets?name=Dataset 1&status.name=Published', function() {
        it('- Should get no record', function(done) {
            request.get('/datasets?name=Dataset 1&status.name=Published')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    //Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 0);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets?status.name=Published', function() {
        it('- Should get one dataset', function(done) {
            request.get('/datasets?status.name=Published')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 1);

                    assert.property(result.body.data[0], 'id');
                    assert.isString(result.body.data[0].id);
                    assert.ok(shortid.isValid(result.body.data[0].id));
                    assert.equal(result.body.data[0].id, 'sWRhpRn');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Dataset 4');

                    assert.property(result.body.data[0], 'status');
                    assert.isObject(result.body.data[0].status);
                    assert.equal(result.body.data[0].status.name, 'Published');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    // Search

    describe('- GET /datasets/search?query=1', function() {
        it('- Should get one dataset', function(done) {
            request.get('/datasets/search?query=1')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 1);

                    assert.property(result.body.data[0], 'id');
                    assert.isString(result.body.data[0].id);
                    assert.ok(shortid.isValid(result.body.data[0].id));
                    assert.equal(result.body.data[0].id, 'sWRhpRk');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Dataset 1');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets/search?query=1,2', function() {
        it('- Should get two datasets', function(done) {
            request.get('/datasets/search?query=1,2')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 2);

                    assert.property(result.body.data[0], 'id');
                    assert.isString(result.body.data[0].id);
                    assert.ok(shortid.isValid(result.body.data[0].id));
                    assert.equal(result.body.data[0].id, 'sWRhpRk');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Dataset 1');

                    assert.property(result.body.data[1], 'id');
                    assert.isString(result.body.data[1].id);
                    assert.ok(shortid.isValid(result.body.data[1].id));
                    assert.equal(result.body.data[1].id, 'sWRhpRl');

                    assert.property(result.body.data[1], 'name');
                    assert.isString(result.body.data[1].name);
                    assert.equal(result.body.data[1].name, 'Dataset 2');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets/search?query=1,2&condition=AND', function() {
        it('- Should get no results', function(done) {
            request.get('/datasets/search?query=1,2&condition=AND')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 0);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets/search?query=arandomstring', function() {
        it('- Should get no results', function(done) {
            request.get('/datasets/search?query=arandomstring')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);
                    assert.lengthOf(result.body.data, 0);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    // RSS Feed
    describe('- GET /datasets/feed/rss', function() {
        it('- Should get the RSS feed', function(done) {
            request.get('/datasets/feed/rss')
                .expect(200)
                .expect('Content-Type', 'application/rss+xml; charset=utf-8')
                .end(function(err) {
                    err ? done(err) : done();
                });
        });
    });

    // Get an inexistent relation for an inexistent item
    describe('- GET /datasets/:fakeId/arandomstring', function() {
        it('- Should get 404 Not Found error', function(done) {
            request.get('/datasets/fakeId/arandomstring')
                .set('Accept', 'application/json')
                .expect(404)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_FOUND');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });

    // 501 Not Implemented Errors

    describe('- DELETE /datasets', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.del('/datasets')
                .set('Accept', 'application/json')
                .expect(501)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_IMPLEMENTED');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });

    describe('- PATCH /datasets', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.patch('/datasets')
                .set('Accept', 'application/json')
                .expect(501)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_IMPLEMENTED');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });

    describe('- PUT /datasets', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.put('/datasets')
                .set('Accept', 'application/json')
                .expect(501)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_IMPLEMENTED');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });
});


/*
 * Single Dataset
 */

describe('Single Dataset', function() {
    // Create dataset
    describe('- POST /datasets', function() {
        it('- Should create a new dataset', function(done) {
            request.post('/datasets')
                .set('Accept', 'application/json')
                .field('name', 'Dataset')
                .field('description', 'An example dataset')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('visible', 'false')
                .field('starred', 'false')
                .field('category', 'mWRhpR3')
                .field('status', 'oWRhpRV')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .expect(201)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body, 'data');
                    assert.isObject(result.body.data);

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    assert.property(result.body.links, 'record');
                    assert.isString(result.body.links.record);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);
                    assert.ok(shortid.isValid(result.body.data.id));

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);

                    assert.property(result.body.data, 'description');
                    assert.isString(result.body.data.description);

                    assert.property(result.body.data, 'notes');
                    assert.isString(result.body.data.notes);

                    assert.property(result.body.data, 'visible');
                    assert.isBoolean(result.body.data.visible);

                    assert.property(result.body.data, 'starred');
                    assert.isBoolean(result.body.data.starred);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    //assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'Dataset');
                    assert.equal(result.body.data.description, 'An example dataset');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    if (!err) {
                        datasetId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Get dataset
    describe('- GET /datasets/:id', function() {
        it('- Should get the dataset', function(done) {
            request.get(`/datasets/${datasetId}?include=datasets`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);
                    assert.ok(shortid.isValid(result.body.data.id));

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);

                    assert.property(result.body.data, 'description');
                    assert.isString(result.body.data.description);

                    assert.property(result.body.data, 'notes');
                    assert.isString(result.body.data.notes);

                    assert.property(result.body.data, 'visible');
                    assert.isBoolean(result.body.data.visible);

                    assert.property(result.body.data, 'starred');
                    assert.isBoolean(result.body.data.starred);

                    assert.property(result.body.data, 'datasets');
                    assert.isArray(result.body.data.datasets);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'Dataset');
                    assert.equal(result.body.data.description, 'An example dataset');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.equal(result.body.data.visible, false);
                    assert.equal(result.body.data.starred, false);

                    err ? done(err) : done();
                });
        });
    });

    // Granular Populate

    describe('- GET /datasets/:id?include=tags.name', function() {
        it('- Should get just the tag names', function(done) {
            request.get('/datasets/sWRhpRk?include=tags.name')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data

                    assert.property(result.body, 'data');
                    assert.isObject(result.body.data);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);
                    assert.ok(shortid.isValid(result.body.data.id));
                    assert.equal(result.body.data.id, 'sWRhpRk');

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);
                    assert.equal(result.body.data.name, 'Dataset 1');

                    assert.property(result.body.data, 'tags');
                    assert.isArray(result.body.data.tags);

                    result.body.data.tags.forEach(function(element) {
                        assert.isObject(element);

                        assert.property(element, 'name');
                        assert.isString(element.name);

                        assert.notProperty(element, 'id');
                        assert.notProperty(element, 'createdAt');
                        assert.notProperty(element, 'updatedAt');
                    }, this);


                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /datasets/:id?include=tags.name,files.name', function() {
        it('- Should get just the tag names and file names', function(done) {
            request.get('/datasets/sWRhpRk?include=tags.name,files.name')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    // Data

                    assert.property(result.body, 'data');
                    assert.isObject(result.body.data);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);
                    assert.ok(shortid.isValid(result.body.data.id));
                    assert.equal(result.body.data.id, 'sWRhpRk');

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);
                    assert.equal(result.body.data.name, 'Dataset 1');

                    assert.property(result.body.data, 'tags');
                    assert.isArray(result.body.data.tags);

                    result.body.data.tags.forEach(function(element) {
                        assert.isObject(element);

                        assert.property(element, 'name');
                        assert.isString(element.name);

                        assert.notProperty(element, 'id');
                        assert.notProperty(element, 'createdAt');
                        assert.notProperty(element, 'updatedAt');
                    }, this);

                    assert.property(result.body.data, 'files');
                    assert.isArray(result.body.data.files);

                    result.body.data.files.forEach(function(element) {
                        assert.isObject(element);

                        assert.property(element, 'name');
                        assert.isString(element.name);

                        assert.notProperty(element, 'id');
                        assert.notProperty(element, 'createdAt');
                        assert.notProperty(element, 'updatedAt');
                    }, this);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    // Get an inexistent relation
    describe('- GET /datasets/:id/arandomstring', function() {
        it('- Should get 404 Not Found error', function(done) {
            request.get(`/datasets/${datasetId}/arandomstring`)
                .set('Accept', 'application/json')
                .expect(404)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_FOUND');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });

    // Edit dataset
    describe('- PATCH /datasets/:id', function() {
        it('- Should edit the dataset', function(done) {
            request.patch(`/datasets/${datasetId}`)
                .set('Accept', 'application/json')
                .field('name', 'Edited Dataset')
                .field('description', 'An example edited dataset')
                .field('visible', 'true')
                .field('datasets', 'kWRhpRV')
                .field('status', 'qWRhpRV')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body, 'data');
                    assert.isObject(result.body.data);

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    assert.property(result.body.links, 'record');
                    assert.isString(result.body.links.record);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);
                    assert.ok(shortid.isValid(result.body.data.id));

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);

                    assert.property(result.body.data, 'description');
                    assert.isString(result.body.data.description);

                    assert.property(result.body.data, 'notes');
                    assert.isString(result.body.data.notes);

                    assert.property(result.body.data, 'visible');
                    assert.isBoolean(result.body.data.visible);

                    assert.property(result.body.data, 'starred');
                    assert.isBoolean(result.body.data.starred);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data.status, 'name');
                    assert.isString(result.body.data.status.name);
                    assert.equal(result.body.data.status.name, 'Published');

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'Edited Dataset');
                    assert.equal(result.body.data.description, 'An example edited dataset');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.equal(result.body.data.visible, true);

                    if (!err) {
                        datasetId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Get edited dataset
    describe('- GET /datasets/:id', function() {
        it('- Should get the edited dataset', function(done) {
            request.get(`/datasets/${datasetId}?include=datasets`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);
                    assert.ok(shortid.isValid(result.body.data.id));

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);

                    assert.property(result.body.data, 'description');
                    assert.isString(result.body.data.description);

                    assert.property(result.body.data, 'notes');
                    assert.isString(result.body.data.notes);

                    assert.property(result.body.data, 'visible');
                    assert.isBoolean(result.body.data.visible);

                    assert.property(result.body.data, 'starred');
                    assert.isBoolean(result.body.data.starred);

                    assert.property(result.body.data, 'datasets');
                    assert.isArray(result.body.data.datasets);

                    assert.property(result.body.data.datasets[0], 'name');
                    assert.isString(result.body.data.datasets[0].name);
                    assert.equal(result.body.data.datasets[0].name, 'Educación');

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data.status, 'name');
                    assert.isString(result.body.data.status.name);
                    assert.equal(result.body.data.status.name, 'Published');

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'Edited Dataset');
                    assert.equal(result.body.data.description, 'An example edited dataset');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.equal(result.body.data.starred, false);

                    err ? done(err) : done();
                });
        });
    });

    // Delete dataset
    describe('- DELETE /datasets/:id', function() {
        it('- Should delete the dataset', function(done) {
            request.del(`/datasets/${datasetId}`)
                .expect(204)
                .end(function(err) {
                    err ? done(err) : done();
                });
        });
    });

    // Check deleted dataset
    describe('- GET /datasets/:id', function() {
        it('- Should get error 404', function(done) {
            request.get(`/datasets/${datasetId}`)
                .set('Accept', 'application/json')
                .expect(404)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_FOUND');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });
});