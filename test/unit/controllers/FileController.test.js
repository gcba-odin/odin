//-- test/unit/controllers/FileController.test.js
'use strict';

require('sails-test-helper');

const sails = require('sails');
const config = require('../../../config/env/test');
const assert = chai.assert;
var csvId, xlsId, xlsxId;

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
                .expect('Content-Type', /json/)
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
                    assert.endsWith(element.url, `/datasets/first`);

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(element.url, `/datasets/last`);

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

                            assert.property(element, 'dataset');
                            assert.isObject(element.dataset);

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

    // 501 Not Implemented Errors

    describe('- DELETE /files', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.del('/files')
                .set('Accept', 'application/json')
                .expect(501)
                .expect('Content-Type', /json/)
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
                .expect('Content-Type', /json/)
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
                .expect('Content-Type', /json/)
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
                .field('dataset', 'sWRhpRl')
                .field('organization', 'hWRhpRV')
                .field('updateFrequency', 'zWRhpR8')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .attach('uploadFile', 'test/assets/example.csv')
                .expect(201)
                .expect('Content-Type', /json/)
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

                    assert.property(result.body.data, 'dataset');
                    assert.isObject(result.body.data.dataset);

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
                .field('dataset', 'sWRhpRl')
                .field('organization', 'hWRhpRV')
                .field('updateFrequency', 'zWRhpR8')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .attach('uploadFile', 'test/assets/example.xls')
                .expect(201)
                .expect('Content-Type', /json/)
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

                    assert.property(result.body.data, 'dataset');
                    assert.isObject(result.body.data.dataset);

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
                .field('dataset', 'sWRhpRl')
                .field('organization', 'hWRhpRV')
                .field('updateFrequency', 'zWRhpR8')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .attach('uploadFile', 'test/assets/example.xlsx')
                .expect(201)
                .expect('Content-Type', /json/)
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

                    assert.property(result.body.data, 'dataset');
                    assert.isObject(result.body.data.dataset);

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
                        done();
                    } else done(err);
                });
        });
    });

    // Check CSV file
    describe('- GET /file/:id [csv]', function() {
        it('- Should get the file', function(done) {
            request.get(`/files/${csvId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
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

                    assert.property(result.body.data, 'dataset');
                    assert.isObject(result.body.data.dataset);

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
                .expect('Content-Type', /json/)
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

                    assert.property(result.body.data, 'dataset');
                    assert.isObject(result.body.data.dataset);

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
                .expect('Content-Type', /json/)
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

                    assert.property(result.body.data, 'dataset');
                    assert.isObject(result.body.data.dataset);

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

    // Check CSV file contents
    describe('- GET /file/:id/contents [csv]', function() {
        it('- Should get the file contents from the DB', function(done) {
            request.get(`/files/${csvId}/contents`)
                .set('Accept', 'application/json')
                .expect(206)
                .expect('Content-Type', /json/)
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
                .expect('Content-Type', /json/)
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
                .expect('Content-Type', /json/)
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
                .end(function(err, result) {
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
                .expect('Content-Type', /json/)
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
                .expect('Content-Type', /json/)
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
                .expect('Content-Type', /json/)
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