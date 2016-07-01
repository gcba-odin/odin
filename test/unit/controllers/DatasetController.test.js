//-- test/unit/controllers/DatasetController.test.js
'use strict';

require('sails-test-helper');

const sails = require('sails');
const config = require('../../../config/env/test');
const assert = chai.assert;
var datasetId;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));

describe('All Datasets', function() {
    describe('GET /datasets', function() {
        it('should get all datasets', function(done) {
            request.get('/datasets')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    if (result.body.data.length > 0) {
                        result.body.data.forEach(function(element) {
                            assert.property(element, 'id');
                            assert.property(element, 'name');
                            assert.property(element, 'description');
                            assert.property(element, 'notes');
                            assert.property(element, 'visible');
                            assert.property(element, 'starred');
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
                            assert.property(element, 'publishedAt');
                            assert.property(element, 'category');
                            assert.property(element, 'status');
                            assert.property(element, 'owner');
                            assert.property(element, 'createdBy');
                        }, this);
                    }

                    err ? done(err) : done();
                });
        });
    });
});

describe('Single Dataset', function() {
    // Create dataset
    describe('POST /datasets', function() {
        it('should create a new dataset', function(done) {
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
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');
                    assert.property(result.body.data, 'name');
                    assert.property(result.body.data, 'description');
                    assert.property(result.body.data, 'notes');
                    assert.property(result.body.data, 'visible');
                    assert.property(result.body.data, 'starred');
                    assert.property(result.body.data, 'category');
                    assert.property(result.body.data, 'status');
                    assert.property(result.body.data, 'owner');
                    assert.property(result.body.data, 'createdBy');

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
    describe('GET /datasets/:id', function() {
        it('should get the dataset', function(done) {
            request.get(`/datasets/${datasetId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    assert.equal(result.body.data.name, 'Dataset');
                    assert.equal(result.body.data.description, 'An example dataset');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');
                    assert.equal(result.body.data.visible, false)
                    assert.equal(result.body.data.starred, false)

                    err ? done(err) : done();
                });
        });
    });

    // Delete dataset
    describe('DELETE /datasets/:id', function() {
        it('should delete the dataset', function(done) {
            request.get(`/datasets/${datasetId}`)
                .set('Accept', 'application/json')
                // .expect(204)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    err ? done(err) : done();
                });
        });
    });
});