//-- test/unit/controllers/DatasetController.test.js
'use strict';

require('sails-test-helper');

const sails = require('sails');
const config = require('../../../config/env/test');
const assert = chai.assert;
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

                            assert.property(element, 'category');
                            assert.isObject(element.category);

                            assert.property(element, 'status');
                            assert.isObject(element.status);

                            assert.property(element, 'owner');
                            assert.isObject(element.owner);

                            assert.property(element, 'createdBy');
                            // assert.isObject(element.createdBy);

                            assert.property(element, 'publishedAt');
                            assert.property(element, 'createdAt');
                            assert.property(element, 'updatedAt');
                        }, this);
                    }

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

    describe('- PATCH /datasets', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.patch('/datasets')
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

    describe('- PUT /datasets', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.put('/datasets')
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

                    assert.property(result.body.data, 'category');
                    assert.isObject(result.body.data.category);

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    //assert.isObject(result.body.data.createdBy);

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
            request.get(`/datasets/${datasetId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);

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

                    assert.property(result.body.data, 'category');
                    assert.isObject(result.body.data.category);

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
                    assert.equal(result.body.data.visible, false)
                    assert.equal(result.body.data.starred, false)

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
                .field('category', 'kWRhpRV')
                .field('status', 'qWRhpRV')
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

                    assert.property(result.body.links, 'record');
                    assert.isString(result.body.links.record);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);

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

                    assert.property(result.body.data, 'category');
                    assert.isObject(result.body.data.category);

                    assert.property(result.body.data.category, 'name');
                    assert.isString(result.body.data.category.name);
                    assert.equal(result.body.data.category.name, 'Educación');

                    assert.property(result.body.data, 'status');
                    assert.isObject(result.body.data.status);

                    assert.property(result.body.data.status, 'name');
                    assert.isString(result.body.data.status.name);
                    assert.equal(result.body.data.status.name, 'Published');

                    assert.property(result.body.data, 'owner');
                    assert.isObject(result.body.data.owner);

                    assert.property(result.body.data, 'createdBy');
                    // assert.isObject(result.body.data.createdBy);

                    assert.equal(result.body.data.name, 'Edited Dataset');
                    assert.equal(result.body.data.description, 'An example edited dataset');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.equal(result.body.data.visible, true)

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
            request.get(`/datasets/${datasetId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);

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

                    assert.property(result.body.data, 'category');
                    assert.isObject(result.body.data.category);

                    assert.property(result.body.data.category, 'name');
                    assert.isString(result.body.data.category.name);
                    assert.equal(result.body.data.category.name, 'Educación');

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
                    assert.equal(result.body.data.starred, false)

                    err ? done(err) : done();
                });
        });
    });

    // Delete dataset
    describe('- DELETE /datasets/:id', function() {
        it('- Should delete the dataset', function(done) {
            request.del(`/datasets/${datasetId}`)
                .expect(204)
                .end(function(err, result) {
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