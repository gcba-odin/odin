//-- test/unit/controllers/FileController.test.js
'use strict';

require('sails-test-helper');

const sails = require('sails');
const config = require('../../../config/env/test');
const assert = chai.assert;
var csvId, xlsId, xlsxId;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));

describe('All Files', function() {
    describe('GET /files', function() {
        it('should get all the files', function(done) {
            request.get('/files')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    assert.isArray(result.body.data);

                    if (result.body.data.length > 0) {
                        result.body.data.forEach(function(element) {
                            assert.property(element, 'name');
                            assert.property(element, 'description');
                            assert.property(element, 'notes');
                            assert.property(element, 'visible');
                            assert.property(element, 'url');
                            assert.property(element, 'publishedAt');
                            assert.property(element, 'type');
                            assert.property(element, 'updateFrequency');
                            assert.property(element, 'status');
                            assert.property(element, 'organization');
                            assert.property(element, 'dataset');
                            assert.property(element, 'owner');
                            assert.property(element, 'createdBy');

                            // assert.startsWith(element.url, `http://127.0.0.1`);
                            // assert.endsWith(element.url, `/files/${element.id}/download`);
                        }, this);
                    }

                    err ? done(err) : done();
                });
        });
    });

    describe('DELETE /files', function() {
        it('should get 501 Method Not Implemented error', function(done) {
            request.del('/files')
                .set('Accept', 'application/json')
                .expect(501)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'links');
                    assert.property(result.body.links, 'all');

                    assert.equal(result.body.meta.code, 'E_NOT_IMPLEMENTED');

                    err ? done(err) : done();
                });
        });
    });
});

describe('Single File', function() {
    // upload CSV
    describe('POST /files [csv]', function() {
        it('should upload a new file [csv]', function(done) {
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
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');
                    assert.property(result.body.data, 'name');
                    assert.property(result.body.data, 'description');
                    assert.property(result.body.data, 'notes');
                    assert.property(result.body.data, 'visible');
                    assert.property(result.body.data, 'url');
                    assert.property(result.body.data, 'type');
                    assert.property(result.body.data, 'updateFrequency');
                    assert.property(result.body.data, 'status');
                    assert.property(result.body.data, 'organization');
                    assert.property(result.body.data, 'dataset');
                    assert.property(result.body.data, 'owner');
                    // assert.property(result.body.data, 'createdBy');

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
    describe('POST /file [xls]', function() {
        it('should upload a new file [xls]', function(done) {
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
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');
                    assert.property(result.body.data, 'name');
                    assert.property(result.body.data, 'description');
                    assert.property(result.body.data, 'notes');
                    assert.property(result.body.data, 'visible');
                    assert.property(result.body.data, 'url');
                    assert.property(result.body.data, 'type');
                    assert.property(result.body.data, 'updateFrequency');
                    assert.property(result.body.data, 'status');
                    assert.property(result.body.data, 'organization');
                    assert.property(result.body.data, 'dataset');
                    assert.property(result.body.data, 'owner');
                    // assert.property(result.body.data, 'createdBy');

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
    describe('POST /file [xlsx]', function() {
        it('should upload a new file [xlsx]', function(done) {
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
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');
                    assert.property(result.body.data, 'name');
                    assert.property(result.body.data, 'description');
                    assert.property(result.body.data, 'notes');
                    assert.property(result.body.data, 'visible');
                    assert.property(result.body.data, 'url');
                    assert.property(result.body.data, 'type');
                    assert.property(result.body.data, 'updateFrequency');
                    assert.property(result.body.data, 'status');
                    assert.property(result.body.data, 'organization');
                    assert.property(result.body.data, 'dataset');
                    assert.property(result.body.data, 'owner');
                    // assert.property(result.body.data, 'createdBy');

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
    describe('GET /file/:id [csv]', function() {
        it('should get the file', function(done) {
            request.get(`/files/${csvId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body.data, 'name');
                    assert.property(result.body.data, 'description');
                    assert.property(result.body.data, 'notes');
                    assert.property(result.body.data, 'visible');
                    assert.property(result.body.data, 'url');
                    assert.property(result.body.data, 'type');
                    assert.property(result.body.data, 'updateFrequency');
                    assert.property(result.body.data, 'status');
                    assert.property(result.body.data, 'organization');
                    assert.property(result.body.data, 'dataset');
                    assert.property(result.body.data, 'owner');
                    // assert.property(result.body.data, 'createdBy');

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
    describe('GET /file/:id [xls]', function() {
        it('should get the file', function(done) {
            request.get(`/files/${xlsId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body.data, 'name');
                    assert.property(result.body.data, 'description');
                    assert.property(result.body.data, 'notes');
                    assert.property(result.body.data, 'visible');
                    assert.property(result.body.data, 'url');
                    assert.property(result.body.data, 'type');
                    assert.property(result.body.data, 'updateFrequency');
                    assert.property(result.body.data, 'status');
                    assert.property(result.body.data, 'organization');
                    assert.property(result.body.data, 'dataset');
                    assert.property(result.body.data, 'owner');
                    //  assert.property(result.body.data, 'createdBy');

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
    describe('GET /file/:id [xlsx]', function() {
        it('should get the file', function(done) {
            request.get(`/files/${xlsxId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body.data, 'name');
                    assert.property(result.body.data, 'description');
                    assert.property(result.body.data, 'notes');
                    assert.property(result.body.data, 'visible');
                    assert.property(result.body.data, 'url');
                    assert.property(result.body.data, 'type');
                    assert.property(result.body.data, 'updateFrequency');
                    assert.property(result.body.data, 'status');
                    assert.property(result.body.data, 'organization');
                    assert.property(result.body.data, 'dataset');
                    assert.property(result.body.data, 'owner');
                    // assert.property(result.body.data, 'createdBy');

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
    describe('GET /file/:id/contents [csv]', function() {
        it('should get the file contents from the DB', function(done) {
            request.get(`/files/${csvId}/contents`)
                .set('Accept', 'application/json')
                //.expect(206)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    err ? done(err) : done();
                });
        });
    });

    // Check XLS file contents
    describe('GET /file/:id/contents [xls]', function() {
        it('should get the file contents from the DB', function(done) {
            request.get(`/files/${xlsId}/contents`)
                .set('Accept', 'application/json')
                //.expect(206)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    err ? done(err) : done();
                });
        });
    });

    // XLSX file contents check
    describe('GET /file/:id/contents [xlsx]', function() {
        it('should get the file contents from the DB', function(done) {
            request.get(`/files/${xlsxId}/contents`)
                .set('Accept', 'application/json')
                // .expect(206)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    err ? done(err) : done();
                });
        });
    });

    // Delete the CSV file
    describe('DELETE /files/:id [csv]', function() {
        it('should delete the file', function(done) {
            request.del(`/files/${csvId}`)
                .expect(204)
                .end(function(err, result) {
                    console.info(csvId);
                    err ? done(err) : done();
                });
        });
    });

    // Delete the XLS file
    describe('DELETE /files/:id [xls]', function() {
        it('should delete the file', function(done) {
            request.del(`/files/${xlsId}`)
                .expect(204)
                .end(function(err, result) {
                    console.info(xlsId);
                    err ? done(err) : done();
                });
        });
    });

    // Delete the XLSX file
    describe('DELETE /files/:id [xlsx]', function() {
        it('should delete the file', function(done) {
            request.del(`/files/${xlsxId}`)
                .expect(204)
                .end(function(err, result) {
                    console.log(`/files/${xlsxId}`);
                    console.log(result.body);
                    err ? done(err) : done();
                });
        });
    });

    // Check deleted CSV file
    describe('GET /file/:id [csv]', function() {
        it('should get error 404', function(done) {
            request.get(`/files/${csvId}`)
                .set('Accept', 'application/json')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    console.dir(result.body);
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'links');
                    err ? done(err) : done();
                });
        });
    });

    // Check deletd XLS file
    describe('GET /file/:id [xls]', function() {
        it('should get error 404', function(done) {
            request.get(`/files/${xlsId}`)
                .set('Accept', 'application/json')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'links');
                    err ? done(err) : done();
                });
        });
    });

    // Check deleted XLSX file
    describe('GET /file/:id [xlsx]', function() {
        it('should get error 404', function(done) {
            request.get(`/files/${xlsxId}`)
                .set('Accept', 'application/json')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'links');
                    assert.property(result.body.links, 'all');

                    assert.equal(result.body.meta.code, 'E_NOT_FOUND');

                    err ? done(err) : done();
                });
        });
    });
});