//-- test/unit/controllers/FileController.test.js
'use strict';

require('sails-test-helper');

const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');
const detectCharacterEncoding = require('detect-character-encoding');
const shortid = require('shortid');
const FileId = 'sWRhpRl';
var csvId, csvName, xlsId, xlsName, xlsxId, xlsxName;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));


/*
 * All Files
 */

describe('All Files', function() {
    describe('- GET /files', function() {
        it('- Should get all the files', function(done) {
            request.get('/files')
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

                    assert.isAtMost(result.body.meta.page, result.body.meta.pages);

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/files/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/files/last');

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

                            assert.property(element, 'url');
                            if (element.url) assert.isString(element.url);

                            assert.property(element, 'type');
                            assert.isObject(element.type);

                            assert.property(element, 'updateFrequency');
                            assert.isObject(element.updateFrequency);

                            assert.property(element, 'status');
                            assert.isObject(element.status);

                            assert.property(element, 'organization');
                            assert.isObject(element.organization);

                            assert.property(element, 'owner');
                            assert.isObject(element.owner);

                            assert.property(element, 'createdBy');
                            // assert.isObject(element.createdBy);

                            assert.property(element, 'createdAt');
                            assert.property(element, 'updatedAt');

                            // assert.startsWith(element.url, `http://127.0.0.1`);
                            // assert.endsWith(element.url, `/files/${element.id}/download`);
                        }, this);
                    }

                    err ? done(err) : done();
                });
        });
    });

    // Pagination

    describe('- GET /files?limit=2', function() {
        it('- Should get the first two files', function(done) {
            request.get('/files?limit=2')
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

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'next');
                    assert.isString(result.body.links.next);
                    assert.endsWith(result.body.links.next, 'files?limit=2&skip=2');

                    assert.property(result.body.links, 'last');
                    assert.isString(result.body.links.last);
                    assert.endsWith(result.body.links.last, 'files?limit=2&skip=4');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/files/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/files/last');

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /files?limit=2&skip=2', function() {
        it('- Should get the next page', function(done) {
            request.get('/files?limit=2&skip=2')
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

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'previous');
                    assert.isString(result.body.links.previous);
                    assert.endsWith(result.body.links.previous, 'files?limit=2&skip=0');

                    assert.property(result.body.links, 'next');
                    assert.isString(result.body.links.next);
                    assert.endsWith(result.body.links.next, 'files?limit=2&skip=4');

                    assert.property(result.body.links, 'first');
                    assert.isString(result.body.links.first);
                    assert.endsWith(result.body.links.first, 'files?limit=2&skip=0');

                    assert.property(result.body.links, 'last');
                    assert.isString(result.body.links.last);
                    assert.endsWith(result.body.links.last, 'files?limit=2&skip=4');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/files/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/files/last');

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /files?limit=2&skip=4', function() {
        it('- Should get the first two files', function(done) {
            request.get('/files?limit=2&skip=4')
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
                    assert.endsWith(result.body.links.previous, 'files?limit=2&skip=2');

                    assert.property(result.body.links, 'first');
                    assert.isString(result.body.links.first);
                    assert.endsWith(result.body.links.first, 'files?limit=2&skip=0');

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(result.body.links.firstItem, '/files/first');

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(result.body.links.lastItem, '/files/last');

                    err ? done(err) : done();
                });
        });
    });

    // Filters

    describe('- GET /files?name=file 1', function() {
        it('- Should get the first file', function(done) {
            request.get('/files?name=file 1')
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
                    assert.equal(result.body.data[0].id, 'sWRhpRa');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'File 1');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /files?name=file 1&status.name=Draft', function() {
        it('- Should get one file', function(done) {
            request.get('/files?name=file 1&status.name=Draft')
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
                    assert.equal(result.body.data[0].id, 'sWRhpRa');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'File 1');

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

    describe('- GET /files?name=file 1&status.name=Published', function() {
        it('- Should get no record', function(done) {
            request.get('/files?name=file 1&status.name=Published')
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

    describe('- GET /files?status.name=Published', function() {
        it('- Should get one file', function(done) {
            request.get('/files?status.name=Published')
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
                    assert.equal(result.body.data[0].id, 'vWRhpRd');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'File 4');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    // Search

    describe('- GET /files/search?query=1', function() {
        it('- Should get one file', function(done) {
            request.get('/files/search?query=1')
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
                    assert.equal(result.body.data[0].id, 'sWRhpRa');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'File 1');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /files/search?query=1,2', function() {
        it('- Should get two files', function(done) {
            request.get('/files/search?query=1,2')
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
                    assert.equal(result.body.data[0].id, 'sWRhpRa');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'File 1');

                    assert.property(result.body.data[1], 'id');
                    assert.isString(result.body.data[1].id);
                    assert.ok(shortid.isValid(result.body.data[1].id));
                    assert.equal(result.body.data[1].id, 'tWRhpRb');

                    assert.property(result.body.data[1], 'name');
                    assert.isString(result.body.data[1].name);
                    assert.equal(result.body.data[1].name, 'File 2');

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    err ? done(err) : done();
                });
        });
    });

    describe('- GET /files/search?query=1,2&condition=AND', function() {
        it('- Should get no results', function(done) {
            request.get('/files/search?query=1,2&condition=AND')
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

    describe('- GET /files/search?query=arandomstring', function() {
        it('- Should get no results', function(done) {
            request.get('/files/search?query=arandomstring')
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

    describe('- DELETE /files', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.del('/files')
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

    describe('- PATCH /files', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.patch('/files')
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

    describe('- PUT /files', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.put('/files')
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
 * Single File
 */

describe('Single File', function() {
    // upload CSV
    describe('- POST /files [csv]', function() {
        it('- Should upload a new file [csv]', function(done) {
            request.post('/files')
                .set('Accept', 'application/json')
                .field('name', 'CSV File')
                .field('description', 'An example file')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('type', 'sWRhpRV')
                .field('status', 'pWRhpRV')
                .field('file', 'sWRhpRl')
                .field('organization', 'hWRhpRV')
                .field('updateFrequency', 'zWRhpR8')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .attach('uploadFile', 'test/assets/example.csv')
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

                    assert.property(result.body.data, 'url');
                    assert.isString(result.body.data.url);

                    assert.property(result.body.data, 'type');
                    assert.isObject(result.body.data.type);

                    assert.property(result.body.data, 'updateFrequency');
                    assert.isObject(result.body.data.updateFrequency);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'organization');
                    assert.isObject(result.body.data.organization);

                    assert.property(result.body.data, 'file');
                    assert.isObject(result.body.data.file);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.equal(result.body.data.name, 'CSV File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    if (!err) {
                        csvId = result.body.data.id;
                        csvName = result.body.data.name;
                        done();
                    } else done(err);
                });
        });
    });

    // upload XLS
    describe('- POST /file [xls]', function() {
        it('- Should upload a new file [xls]', function(done) {
            request.post('/files')
                .set('Accept', 'application/json')
                .field('name', 'XLS File')
                .field('description', 'An example file')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('type', 'sWRhpRV')
                .field('status', 'pWRhpRV')
                .field('file', 'sWRhpRl')
                .field('organization', 'hWRhpRV')
                .field('updateFrequency', 'zWRhpR8')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .attach('uploadFile', 'test/assets/example.xls')
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

                    assert.property(result.body.data, 'url');
                    assert.isString(result.body.data.url);

                    assert.property(result.body.data, 'type');
                    assert.isObject(result.body.data.type);

                    assert.property(result.body.data, 'updateFrequency');
                    assert.isObject(result.body.data.updateFrequency);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'organization');
                    assert.isObject(result.body.data.organization);

                    assert.property(result.body.data, 'file');
                    assert.isObject(result.body.data.file);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.equal(result.body.data.name, 'XLS File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    if (!err) {
                        xlsId = result.body.data.id;
                        xlsName = result.body.data.name;
                        done();
                    } else done(err);
                });
        });
    });

    // upload XLSX
    describe('- POST /file [xlsx]', function() {
        it('- Should upload a new file [xlsx]', function(done) {
            request.post('/files')
                .set('Accept', 'application/json')
                .field('name', 'XLSX File')
                .field('description', 'An example file')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('type', 'sWRhpRV')
                .field('status', 'pWRhpRV')
                .field('file', 'sWRhpRl')
                .field('organization', 'hWRhpRV')
                .field('updateFrequency', 'zWRhpR8')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .attach('uploadFile', 'test/assets/example.xlsx')
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

                    assert.property(result.body.data, 'url');
                    assert.isString(result.body.data.url);

                    assert.property(result.body.data, 'type');
                    assert.isObject(result.body.data.type);

                    assert.property(result.body.data, 'updateFrequency');
                    assert.isObject(result.body.data.updateFrequency);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'organization');
                    assert.isObject(result.body.data.organization);

                    assert.property(result.body.data, 'file');
                    assert.isObject(result.body.data.file);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.equal(result.body.data.name, 'XLSX File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    if (!err) {
                        xlsxId = result.body.data.id;
                        xlsxName = result.body.data.name;
                        done();
                    } else done(err);
                });
        });
    });

    // Check CSV file encoding
    describe('- File encoding', function() {
        it('- Should check that the folder exists', function(done) {
            assert.isDirectory('/tmp/odin');
        });

        it('- Should check that the file exists', function(done) {
            assert.isFile(`/tmp/odin/${FileId}/${csvName}.csv`);
        });

        it('- Should check that the file is UTF-8 encoded', function(done) {
            let fileBuffer = fs.readFileSync(`/tmp/odin/${FileId}/${csvName}.csv`);
            let charsetMatch = detectCharacterEncoding(fileBuffer);

            assert.equal(charsetMatch.encoding, 'UTF-8');
        });
    });

    // Check XLS file existence
    describe('- XLS file check', function() {
        it('- Should check that the folder exists', function(done) {
            assert.isDirectory('/tmp/odin');
        });

        it('- Should check that the file exists', function(done) {
            assert.isFile(`/tmp/odin/${FileId}/${xlsName}.xls`);
        });
    });

    // Check XLSX file existence
    describe('- XLSX file check', function() {
        it('- Should check that the folder exists', function(done) {
            assert.isDirectory('/tmp/odin');
        });

        it('- Should check that the file exists', function(done) {
            assert.isFile(`/tmp/odin/${FileId}/${xlsxName}.xlsx`);
        });
    });

    // Check CSV file
    describe('- GET /file/:id [csv]', function() {
        it('- Should get the file', function(done) {
            request.get(`/files/${csvId}`)
                .set('Accept', 'application/json')
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

                    assert.property(result.body.data, 'url');
                    assert.isString(result.body.data.url);

                    assert.property(result.body.data, 'type');
                    assert.isObject(result.body.data.type);

                    assert.property(result.body.data, 'updateFrequency');
                    assert.isObject(result.body.data.updateFrequency);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'organization');
                    assert.isObject(result.body.data.organization);

                    assert.property(result.body.data, 'file');
                    assert.isObject(result.body.data.file);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.equal(result.body.data.name, 'CSV File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    err ? done(err) : done();
                });
        });
    });

    // Check XLS file
    describe('- GET /file/:id [xls]', function() {
        it('- Should get the file', function(done) {
            request.get(`/files/${xlsId}`)
                .set('Accept', 'application/json')
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

                    assert.property(result.body.data, 'url');
                    assert.isString(result.body.data.url);

                    assert.property(result.body.data, 'type');
                    assert.isObject(result.body.data.type);

                    assert.property(result.body.data, 'updateFrequency');
                    assert.isObject(result.body.data.updateFrequency);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'organization');
                    assert.isObject(result.body.data.organization);

                    assert.property(result.body.data, 'file');
                    assert.isObject(result.body.data.file);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.equal(result.body.data.name, 'XLS File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    err ? done(err) : done();
                });
        });
    });

    // Check XLSX file
    describe('- GET /file/:id [xlsx]', function() {
        it('- Should get the file', function(done) {
            request.get(`/files/${xlsxId}`)
                .set('Accept', 'application/json')
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

                    assert.property(result.body.data, 'url');
                    assert.isString(result.body.data.url);

                    assert.property(result.body.data, 'type');
                    assert.isObject(result.body.data.type);

                    assert.property(result.body.data, 'updateFrequency');
                    assert.isObject(result.body.data.updateFrequency);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'organization');
                    assert.isObject(result.body.data.organization);

                    assert.property(result.body.data, 'file');
                    assert.isObject(result.body.data.file);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.equal(result.body.data.name, 'XLSX File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    err ? done(err) : done();
                });
        });
    });

    // Granular Populate

    describe('- GET /files/:id?include=tags.name', function() {
        it('- Should get just the tag names', function(done) {
            request.get('/files/sWRhpRk?include=tags.name')
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
                    assert.equal(result.body.data[0].id, 'sWRhpRa');

                    assert.property(result.body.data[0], 'name');
                    assert.isString(result.body.data[0].name);
                    assert.equal(result.body.data[0].name, 'File 1');

                    assert.property(result.body.data[0], 'tags');
                    assert.isArray(result.body.data[0].tags);

                    result.body.data[0].tags.forEach(function(element) {
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

    // Check CSV file contents
    describe('- GET /file/:id/contents [csv]', function() {
        it('- Should get the file contents from the DB', function(done) {
            request.get(`/files/${csvId}/contents`)
                .set('Accept', 'application/json')
                .expect(206)
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

                    err ? done(err) : done();
                });
        });
    });

    // Check XLS file contents
    describe('- GET /file/:id/contents [xls]', function() {
        it('- Should get the file contents from the DB', function(done) {
            request.get(`/files/${xlsId}/contents`)
                .set('Accept', 'application/json')
                .expect(206)
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

                    err ? done(err) : done();
                });
        });
    });

    // XLSX file contents check
    describe('- GET /file/:id/contents [xlsx]', function() {
        it('- Should get the file contents from the DB', function(done) {
            request.get(`/files/${xlsxId}/contents`)
                .set('Accept', 'application/json')
                .expect(206)
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

                    err ? done(err) : done();
                });
        });
    });

    // CSV file download
    describe('- GET /file/:id/download [csv]', function() {
        it('- Should download the file', function(done) {
            request.get(`/files/${csvId}/download`)
                .expect(200)
                .expect('Content-Disposition', /attachment/)
                .end(function(err) {
                    err ? done(err) : done();
                });
        });
    });

    // XLS file download
    describe('- GET /file/:id/download [xls]', function() {
        it('- Should download the file', function(done) {
            request.get(`/files/${xlsId}/download`)
                .expect(200)
                .expect('Content-Disposition', /attachment/)
                .end(function(err, result) {
                    err ? done(err) : done();
                });
        });
    });

    // XLSX file download
    describe('- GET /file/:id/download [xlsx]', function() {
        it('- Should download the file', function(done) {
            request.get(`/files/${xlsxId}/download`)
                .expect(200)
                .expect('Content-Disposition', /attachment/)
                .end(function(err, result) {
                    err ? done(err) : done();
                });
        });
    });

    // Delete the CSV file
    describe('- DELETE /files/:id [csv]', function() {
        it('- Should delete the file', function(done) {
            request.del(`/files/${csvId}`)
                .expect(204)
                .end(function(err, result) {
                    err ? done(err) : done();
                });
        });
    });

    // Delete the XLS file
    describe('- DELETE /files/:id [xls]', function() {
        it('- Should delete the file', function(done) {
            request.del(`/files/${xlsId}`)
                .expect(204)
                .end(function(err, result) {
                    err ? done(err) : done();
                });
        });
    });

    // Delete the XLSX file
    describe('- DELETE /files/:id [xlsx]', function() {
        it('- Should delete the file', function(done) {
            request.del(`/files/${xlsxId}`)
                .expect(204)
                .end(function(err, result) {
                    err ? done(err) : done();
                });
        });
    });

    // Check deleted CSV file
    describe('- GET /file/:id [csv]', function() {
        it('- Should get error 404', function(done) {
            request.get(`/files/${csvId}`)
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

    // Check deletd XLS file
    describe('- GET /file/:id [xls]', function() {
        it('- Should get error 404', function(done) {
            request.get(`/files/${xlsId}`)
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

    // Check deleted XLSX file
    describe('- GET /file/:id [xlsx]', function() {
        it('- Should get error 404', function(done) {
            request.get(`/files/${xlsxId}`)
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
