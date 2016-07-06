//-- test/unit/controllers/ChartController.test.js
'use strict';

require('sails-test-helper');

const chai = require('chai');
const assert = chai.assert;
const shortid = require('shortid');
var chartId;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));


/*
 * All Charts
 */

describe('All Charts', function() {
    describe('- GET /charts', function() {
        it('- Should get all charts', function(done) {
            request.get('/charts')
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
                    assert.endsWith(result.body.links.firstItem, '/charts/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/charts/last');

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

                            assert.property(element, 'embedCode');
                            if (element.embedCode) assert.isString(element.embedCode);

                            assert.property(element, 'url');
                            if (element.url) assert.isString(element.url);

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

    describe('- GET /charts?limit=2', function() {
        it('- Should get the first two charts', function(done) {
            request.get('/charts?limit=2')
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
                    assert.endsWith(result.body.links.next, 'charts?limit=2&skip=2');

                    assert.property(result.body.links, 'last');
                    assert.isString(result.body.links.last);
                    assert.endsWith(result.body.links.last, 'charts?limit=2&skip=4');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/charts/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/charts/last');

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /charts?limit=2&skip=2', function() {
        it('- Should get the next page', function(done) {
            request.get('/charts?limit=2&skip=2')
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
                    assert.endsWith(result.body.links.previous, 'charts?limit=2&skip=0');

                    assert.property(result.body.links, 'next');
                    assert.isString(result.body.links.next);
                    assert.endsWith(result.body.links.next, 'charts?limit=2&skip=2');

                    assert.property(result.body.links, 'first');
                    assert.isString(result.body.links.first);
                    assert.endsWith(result.body.links.first, 'charts?limit=2&skip=0');

                    assert.property(result.body.links, 'last');
                    assert.isString(result.body.links.last);
                    assert.endsWith(result.body.links.last, 'charts?limit=2&skip=4');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/charts/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/charts/last');

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /charts?limit=2&skip=4', function() {
        it('- Should get the last charts', function(done) {
            request.get('/charts?limit=2&skip=4')
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
                    assert.endsWith(result.body.links.previous, 'charts?limit=2&skip=2');

                    assert.property(result.body.links, 'first');
                    assert.isString(result.body.links.first);
                    assert.endsWith(result.body.links.first, 'charts?limit=2&skip=0');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/charts/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/charts/last');

                    err ? done(err) : done();
                });
        });
    });

    // Filters

    describe('- GET /charts?name=Chart 1', function() {
        it('- Should get the first chart', function(done) {
            request.get('/charts?name=Chart 1')
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
                    assert.equal(result.body.data[0].id, '1ogPbIz9');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Chart 1');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /charts?name=Chart 1&createdBy.username=admin', function() {
        it('- Should get one chart', function(done) {
            request.get('/charts?name=Chart 1&createdBy.username=admin')
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
                    assert.equal(result.body.data[0].id, '1ogPbIz9');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Chart 1');

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

    describe('- GET /charts?name=Chart 1&createdBy.username=arandomstring', function() {
        it('- Should get no record', function(done) {
            request.get('/charts?name=Chart 1&createdBy.username=arandomstring')
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

    describe('- GET /charts/search?query=1', function() {
        it('- Should get one chart', function(done) {
            request.get('/charts/search?query=1')
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
                    assert.equal(result.body.data[0].id, '1ogPbIz9');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Chart 1');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /charts/search?query=1,2', function() {
        it('- Should get two charts', function(done) {
            request.get('/charts/search?query=1,2')
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
                    assert.equal(result.body.data[0].id, '1ogPbIz9');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'Chart 1');

                    assert.property(result.body.data[1], 'id');
                    assert.isString(result.body.data[1].id);
                    assert.ok(shortid.isValid(result.body.data[1].id));
                    assert.equal(result.body.data[1].id, '2ogPbIz9');

                    assert.property(result.body.data[1], 'name');
                    assert.isString(result.body.data[1].name);
                    assert.equal(result.body.data[1].name, 'Chart 2');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /charts/search?query=1,2&condition=AND', function() {
        it('- Should get no results', function(done) {
            request.get('/charts/search?query=1,2&condition=AND')
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

    describe('- GET /charts/search?query=arandomstring', function() {
        it('- Should get no results', function(done) {
            request.get('/charts/search?query=arandomstring')
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

    // 501 Not Implemented Errors

    describe('- DELETE /charts', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.del('/charts')
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

    describe('- PATCH /charts', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.patch('/charts')
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

    describe('- PUT /charts', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.put('/charts')
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
 * Single Chart
 */

describe('Single Chart', function() {
    // Create chart
    describe('- POST /charts', function() {
        it('- Should create a new chart', function(done) {
            request.post('/charts')
                .set('Accept', 'application/json')
                .field('name', 'Chart')
                .field('description', 'An example chart')
                .field('notes', 'Lorem ipsum dolor sit amet...')
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

                    assert.equal(result.body.data.name, 'Chart');
                    assert.equal(result.body.data.description, 'An example chart');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    if (!err) {
                        chartId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Get chart
    describe('- GET /charts/:id', function() {
        it('- Should get the chart', function(done) {
            request.get(`/charts/${chartId}`)
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

                    assert.equal(result.body.data.name, 'Chart');
                    assert.equal(result.body.data.description, 'An example chart');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.equal(result.body.data.visible, false);
                    assert.equal(result.body.data.starred, false);

                    err ? done(err) : done();
                });
        });
    });

    // Edit chart
    describe('- PATCH /charts/:id', function() {
        it('- Should edit the chart', function(done) {
            request.patch(`/charts/${chartId}`)
                .set('Accept', 'application/json')
                .field('name', 'Edited Chart')
                .field('description', 'An example edited chart')
                .field('createdBy', 'qWRhpRV')
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

                    assert.property(result.body.data, 'embedCode');
                    assert.isString(result.body.data.embedCode);

                    assert.property(result.body.data.createdBy, 'name');
                    assert.isString(result.body.data.createdBy.username);
                    assert.equal(result.body.data.createdBy.username, 'admin');

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'Edited Chart');
                    assert.equal(result.body.data.description, 'An example edited chart');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.equal(result.body.data.visible, true);

                    if (!err) {
                        chartId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Get edited chart
    describe('- GET /charts/:id', function() {
        it('- Should get the edited chart', function(done) {
            request.get(`/charts/${chartId}`)
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

                    assert.property(result.body.data, 'embedCode');
                    assert.isString(result.body.data.embedCode);

                    assert.property(result.body.data.createdBy, 'name');
                    assert.isString(result.body.data.createdBy.username);
                    assert.equal(result.body.data.createdBy.username, 'admin');

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.property(result.body.data, 'createdAt');
                    assert.property(result.body.data, 'updatedAt');

                    assert.equal(result.body.data.name, 'Edited Chart');
                    assert.equal(result.body.data.description, 'An example edited chart');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.equal(result.body.data.starred, false);

                    err ? done(err) : done();
                });
        });
    });

    // Delete chart
    describe('- DELETE /charts/:id', function() {
        it('- Should delete the chart', function(done) {
            request.del(`/charts/${chartId}`)
                .expect(204)
                .end(function(err, result) {
                    err ? done(err) : done();
                });
        });
    });

    // Check deleted chart
    describe('- GET /charts/:id', function() {
        it('- Should get error 404', function(done) {
            request.get(`/charts/${chartId}`)
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