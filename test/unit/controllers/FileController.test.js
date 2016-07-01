//-- test/unit/controllers/FileController.test.js
"use strict";

require("sails-test-helper");

const sails = require('sails');
const config = require('../../../config/env/test');
const assert = chai.assert;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));

describe('All Files', function() {
    describe("GET /files", function() {
        it("should get all files", function(done) {
            request.get("/files")
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    err ? done(err) : done();
                });
        });
    });
});

describe('Single File', function() {
    // CSV upload
    describe("POST /files [csv]", function() {
        it("should upload a new file [csv]", function(done) {
            request.post("/files")
                .set('Accept', 'application/json')
                .field('name', 'CSV File')
                .field('description', 'An example file')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('type', 'sWRhpRV')
                .field('status', 'pWRhpRV')
                .field('dataset', 'sWRhpRkh')
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

                    assert.equal(result.body.data.name, 'CSV File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    err ? done(err) : done();
                });
        });
    });

    // XLS upload
    describe("POST /file [xls]", function() {
        it("should upload a new file [xls]", function(done) {
            request.post("/files")
                .set('Accept', 'application/json')
                .field('name', 'XLS File')
                .field('description', 'An example file')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('type', 'sWRhpRV')
                .field('status', 'pWRhpRV')
                .field('dataset', 'sWRhpRkh')
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

                    assert.equal(result.body.data.name, 'XLS File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    err ? done(err) : done();
                });
        });
    });

    // XLSX upload
    describe("POST /file [xlsx]", function() {
        it("should upload a new file [xlsx]", function(done) {
            request.post("/files")
                .set('Accept', 'application/json')
                .field('name', 'XLSX File')
                .field('description', 'An example file')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('type', 'sWRhpRV')
                .field('status', 'pWRhpRV')
                .field('dataset', 'sWRhpRkh')
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

                    assert.equal(result.body.data.name, 'XLSX File');
                    assert.equal(result.body.data.description, 'An example file');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.startsWith(result.body.data.url, `http://127.0.0.1`);
                    assert.endsWith(result.body.data.url, `/files/${result.body.data.id}/download`);

                    err ? done(err) : done();
                });
        });
    });
});