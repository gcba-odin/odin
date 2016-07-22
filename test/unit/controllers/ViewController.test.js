//-- test/unit/controllers/ViewController.test.js
'use strict';

require('sails-test-helper');

const chai = require('chai');
const assert = chai.assert;
const shortid = require('shortid');
var viewId;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));


/*
 * All Views
 */

describe('All Views', function() {
    describe('- GET /views', function() {
        it('- Should get all views', function(done) {
            request.get('/views')
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
                    assert.endsWith(result.body.links.firstItem, '/views/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/views/last');

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

    describe('- GET /views?limit=2', function() {
        it('- Should get the first two views', function(done) {
            request.get('/views?limit=2')
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
                    assert.endsWith(result.body.links.next, 'views?limit=2&skip=2');

                    assert.property(result.body.links, 'last');
                    assert.isString(result.body.links.last);
                    assert.endsWith(result.body.links.last, 'views?limit=2&skip=4');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/views/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/views/last');

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /views?limit=2&skip=2', function() {
        it('- Should get the next page', function(done) {
            request.get('/views?limit=2&skip=2')
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
                    assert.endsWith(result.body.links.previous, 'views?limit=2&skip=0');

                    assert.property(result.body.links, 'next');
                    assert.isString(result.body.links.next);
                    assert.endsWith(result.body.links.next, 'views?limit=2&skip=4');

                    assert.property(result.body.links, 'first');
                    assert.isString(result.body.links.first);
                    assert.endsWith(result.body.links.first, 'views?limit=2&skip=0');

                    assert.property(result.body.links, 'last');
                    assert.isString(result.body.links.last);
                    assert.endsWith(result.body.links.last, 'views?limit=2&skip=4');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/views/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/views/last');

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /views?limit=2&skip=4', function() {
        it('- Should get the last views', function(done) {
            request.get('/views?limit=2&skip=4')
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
                    assert.endsWith(result.body.links.previous, 'views?limit=2&skip=2');

                    assert.property(result.body.links, 'first');
                    assert.isString(result.body.links.first);
                    assert.endsWith(result.body.links.first, 'views?limit=2&skip=0');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/views/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/views/last');

                    err ? done(err) : done();
                });
        });
    });

    // Filters

    describe('- GET /views?name=View 1', function() {
        it('- Should get the first view', function(done) {
            request.get('/views?name=View 1')
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
                    assert.equal(result.body.data[0].id, '1ogP1Iz9');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'View 1');


                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);


                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /views?name=View 1&createdBy.username=admin', function() {
        it('- Should get one view', function(done) {
            request.get('/views?name=View 1&createdBy.username=admin')
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
                    assert.equal(result.body.data[0].id, '1ogP1Iz9');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'View 1');

                    assert.property(result.body.data[0], 'createdBy');
                    assert.isObject(result.body.data[0].createdBy);
                    assert.equal(result.body.data[0].createdBy.username, 'admin');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /views?name=View 1&createdBy.username=arandomstring', function() {
        it('- Should get no record', function(done) {
            request.get('/views?name=View 1&createdBy.username=arandomstring')
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

    // Search

    describe('- GET /views/search?query=1', function() {
        it('- Should get one view', function(done) {
            request.get('/views/search?query=1')
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
                    assert.equal(result.body.data[0].id, '1ogP1Iz9');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'View 1');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /views/search?query=1,2', function() {
        it('- Should get two views', function(done) {
            request.get('/views/search?query=1,2')
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
                    assert.equal(result.body.data[0].id, '1ogP1Iz9');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'View 1');

                    assert.property(result.body.data[1], 'id');
                    assert.isString(result.body.data[1].id);
                    assert.ok(shortid.isValid(result.body.data[1].id));
                    assert.equal(result.body.data[1].id, '2ogP2Iz9');

                    assert.property(result.body.data[1], 'name');
                    assert.isString(result.body.data[1].name);
                    assert.equal(result.body.data[1].name, 'View 2');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /views/search?query=1,2&condition=AND', function() {
        it('- Should get no results', function(done) {
            request.get('/views/search?query=1,2&condition=AND')
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

    describe('- GET /views/search?query=arandomstring', function() {
        it('- Should get no results', function(done) {
            request.get('/views/search?query=arandomstring')
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

    // Get an inexistent relation for an inexistent item
    describe('- GET /views/:fakeId/arandomstring', function() {
        it('- Should get 404 Not Found error', function(done) {
            request.get('/views/fakeId/arandomstring')
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

                    assert.property(result.body.links, 'entryPoint');
                    assert.isString(result.body.links.entryPoint);

                    err ? done(err) : done();
                });
        });
    });

    // 501 Not Implemented Errors

    describe('- DELETE /views', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.del('/views')
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

    describe('- PATCH /views', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.patch('/views')
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

    describe('- PUT /views', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.put('/views')
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
 * Single view
 */

describe('Single view', function() {
    // Create view
    describe('- POST /views', function() {
        it('- Should create a new view', function(done) {
            request.post('/views')
                .set('Accept', 'application/json')
                .field('name', 'View')
                .field('description', 'An example view')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('tags', 'tWRhpz2,uWRhpz2,vWRhpz2')
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

                    assert.property(result.body.data, 'createdBy');
                    //assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'View');
                    assert.equal(result.body.data.description, 'An example view');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    if (!err) {
                        viewId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Get view
    describe('- GET /views/:id', function() {
        it('- Should get the view', function(done) {
            request.get(`/views/${viewId}`)
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

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'View');
                    assert.equal(result.body.data.description, 'An example view');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    err ? done(err) : done();
                });
        });
    });

    // Granular Populate

    describe('- GET /views/:id?include=tags.name', function() {
        it('- Should get just the tag names', function(done) {
            request.get('/views/1ogP1Iz9?include=tags.name')
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
                    assert.equal(result.body.data.id, '1ogP1Iz9');

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);
                    assert.equal(result.body.data.name, 'View 1');

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

    // Get an inexistent relation
    describe('- GET /views/:id/arandomstring', function() {
        it('- Should get 404 Not Found error', function(done) {
            request.get(`/views/${viewId}/arandomstring`)
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

    // Edit view
    describe('- PATCH /views/:id', function() {
        it('- Should edit the view', function(done) {
            request.patch(`/views/${viewId}`)
                .set('Accept', 'application/json')
                .field('name', 'Edited View')
                .field('description', 'An example edited view')
                .field('createdBy', 'nYrnfYEv')
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

                    assert.property(result.body.data, 'createdBy');
                    assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data.createdBy, 'username');
                    assert.isString(result.body.data.createdBy.username);
                    assert.equal(result.body.data.createdBy.username, 'howardfoster');

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'Edited View');
                    assert.equal(result.body.data.description, 'An example edited view');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    if (!err) {
                        viewId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Get edited view
    describe('- GET /views/:id', function() {
        it('- Should get the edited view', function(done) {
            request.get(`/views/${viewId}`)
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

                    assert.property(result.body.data, 'createdBy');
                    assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data.createdBy, 'username');
                    assert.isString(result.body.data.createdBy.username);
                    assert.equal(result.body.data.createdBy.username, 'howardfoster');

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'Edited View');
                    assert.equal(result.body.data.description, 'An example edited view');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    err ? done(err) : done();
                });
        });
    });

    // Delete view
    describe('- DELETE /views/:id', function() {
        it('- Should delete the view', function(done) {
            request.del(`/views/${viewId}`)
                .expect(204)
                .end(function(err) {
                    err ? done(err) : done();
                });
        });
    });

    // Check deleted view
    describe('- GET /views/:id', function() {
        it('- Should get error 404', function(done) {
            request.get(`/views/${viewId}`)
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
